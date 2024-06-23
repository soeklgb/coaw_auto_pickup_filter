import maginai from "maginai";
import * as _maginai_game_types from "maginai-game-types";
import * as parser from "./parser.ts";
import { createItemNameToIdMap, ItemNameToIdMap } from "./itemNameToIdMap.ts";
import { createItemKindToIdMap, ItemKindToIdMap } from "./itemKindToIdMap.ts";
import {
  isSkillBookNameWithoutLevel,
  removeLevelFromSkillBookName,
} from "./utils.ts";
import { logger } from "./logger.ts";
import { getText } from "./language.ts";

class AutoPickupFilter {
  private kanteiFilter: Map<string, number>;
  private mikanteiFilter: Map<string, number>;
  private askillBookFilter: Map<string, number>;

  private itemKindToIdMap: ItemKindToIdMap;
  private itemNameToIdMap: ItemNameToIdMap;

  private globalData: string;
  private localData: string;

  constructor() {
    this.kanteiFilter = new Map();
    this.mikanteiFilter = new Map();
    this.askillBookFilter = new Map();

    this.itemKindToIdMap = new Map();
    this.itemNameToIdMap = new Map();

    this.globalData = "";
    this.localData = "";
  }

  init(): void {
    maginai.events.gameLoadFinished.addHandler(() => {
      const itemKindToIdMap = createItemKindToIdMap();
      if (itemKindToIdMap !== undefined) {
        this.itemKindToIdMap = itemKindToIdMap;
      }

      const itemNameToIdMap = createItemNameToIdMap();
      if (itemNameToIdMap !== undefined) {
        this.itemNameToIdMap = itemNameToIdMap;
      }
    });

    let duringPlayerAutoFootPickupItem = false;

    maginai.patcher2.patchMethod(
      tGameRoutineMap,
      "playerAutoFootPickupItem",
      (_self, original, args) => {
        duringPlayerAutoFootPickupItem = true;
        const result = original(...args);
        duringPlayerAutoFootPickupItem = false;
        return result;
      },
    );

    maginai.patcher2.patchMethod(
      tGameCharactor,
      "pickupItem",
      (_self, original, args) => {
        let result: boolean | undefined = undefined;
        try {
          result = (() => {
            if (!duringPlayerAutoFootPickupItem) return true;

            const item = args[0].object.data[7];
            const itemId = item[1].toString();
            const kantei = item[2] === 2;
            const isSkillBook = item[0] === 19;
            const isCursed = item[14] !== 0;

            const filter = (() => {
              if (kantei) {
                if (isSkillBook) {
                  const name = removeLevelFromSkillBookName(
                    item[4],
                  );
                  if (name === undefined) {
                    return this.kanteiFilter.get(itemId);
                  } else if (
                    this.kanteiFilter.has("すべて")
                  ) {
                    return this.kanteiFilter.get("すべて");
                  } else if (
                    this.askillBookFilter.has(name)
                  ) {
                    return this.askillBookFilter.get(name);
                  } else {
                    return this.kanteiFilter.get(itemId);
                  }
                } else {
                  return this.kanteiFilter.get(itemId);
                }
              } else {
                return this.mikanteiFilter.get(itemId);
              }
            })();

            if (filter === undefined) return true;
            if (filter === 0) return false;

            const player = args[0].charactor;

            if (tWgm.tGameItem.getEnableGroupItem(item) === 1) {
              let nonCursedItemNum = 0;
              let cursedItemNum = 0;
              const nonCursedItem = structuredClone(item);
              const cursedItem = structuredClone(item);
              nonCursedItem[14] = 0;
              cursedItem[14] = 1;

              for (const inventoryItem of player.items) {
                if (
                  tWgm.tGameItem.checkCompileItem(
                    nonCursedItem,
                    inventoryItem,
                  )
                ) {
                  nonCursedItemNum += inventoryItem[10];
                }
                if (
                  tWgm.tGameItem.checkCompileItem(
                    cursedItem,
                    inventoryItem,
                  )
                ) {
                  cursedItemNum += inventoryItem[10];
                }
              }

              let desired = 0;
              if (!isCursed) {
                desired = Math.max(
                  0,
                  filter - nonCursedItemNum,
                );
              } else {
                desired = Math.max(
                  0,
                  filter - (nonCursedItemNum + cursedItemNum),
                );
              }
              args[0].num = Math.min(args[0].num, desired);
            }

            return true;
          })();
        } catch (error) {
          logger.error(error);
        }

        switch (result) {
          case true:
            return original(...args);
          case false:
            return [false];
          default:
            return original(...args);
        }
      },
    );

    maginai.events.saveLoaded.addHandler(() => {
      const saveNumber = tWgm.tGameSave.saveNumber as number;

      (async () => {
        try {
          this.localData = await loadLocalData(saveNumber);
        } catch (_error) {
          // ローカルデータが存在しない
          if (await existsIncorrectLocalData(saveNumber)) {
            tWgm.tGameLog.addLog(
              getText("exists_incorrect_local_data.0"),
              false,
            );
            tWgm.tGameLog.addLog(
              tWgm.tGameTalkResource.convertValue(
                getText("exists_incorrect_local_data.1"),
                [saveNumber],
                undefined,
              ),
              false,
            );
            tWgm.tGameLog.addLog(
              tWgm.tGameTalkResource.convertValue(
                getText("exists_incorrect_local_data.2"),
                [saveNumber],
                undefined,
              ),
              false,
            );
          }
        }

        this.initFilter();
      })();
    });

    maginai.setModPostprocess((async () => {
      try {
        this.globalData = await loadGlobalData();
      } catch (_error) {
        // グローバルデータが存在しない
      }
    })());
  }

  private initFilter(): void {
    const rules = parser.parse(this.getData());

    for (const rule of rules) {
      switch (rule.prefix) {
        case "#": {
          break;
        }
        case "-": {
          if (isSkillBookNameWithoutLevel(rule.value)) {
            this.askillBookFilter.set(rule.value, 1);
          } else {
            if (
              rule.value === getText("kind.skill_book") ||
              rule.value === getText("kind.all")
            ) {
              this.askillBookFilter.clear();
            }
            const ids = [
              ...this.itemKindToIdMap.get(rule.value) ?? [],
              ...this.itemNameToIdMap.get(rule.value) ?? [],
            ];
            for (const id of ids) {
              this.kanteiFilter.delete(id);
            }
          }
          break;
        }
        default: {
          if (isSkillBookNameWithoutLevel(rule.value)) {
            this.askillBookFilter.set(rule.value, rule.prefix);
          } else {
            if (
              rule.value === getText("kind.skill_book") ||
              rule.value === getText("kind.all")
            ) {
              this.askillBookFilter.clear();
            }
            const ids = [
              ...this.itemKindToIdMap.get(rule.value) ?? [],
              ...this.itemNameToIdMap.get(rule.value) ?? [],
            ];
            for (const id of ids) {
              this.kanteiFilter.set(id, rule.prefix);
            }
          }
          break;
        }
      }
    }

    this.mikanteiFilter = this.createMikanteiFilter();
  }

  private createMikanteiFilter(): Map<string, number> {
    const mikanteiFilter = new Map<string, number>();

    const iconCountMap0 = new Map<string, number>();
    const iconCountMap1 = new Map<string, number>();
    const iconMaxNumMap = new Map<string, number>();

    const items = tWgm.tGameItem.masterData.items;
    const etcitems = tWgm.tGameItem.masterData.etcitems;
    const equips = tWgm.tGameItem.masterData.equips;

    for (const itemId in items) {
      const item = tWgm.tGameItem.createItem({
        itemId,
        isShikibetsu: true,
        isNoroi: false,
      });
      const characteristic = tWgm.tGameItem.getItemCharacteristic(item);
      const iconName = characteristic.pattern[1];
      iconCountMap0.set(iconName, (iconCountMap0.get(iconName) ?? 0) + 1);
    }
    for (const itemId in etcitems) {
      const item = tWgm.tGameItem.createItem({
        itemId,
        isShikibetsu: true,
        isNoroi: false,
      });
      const characteristic = tWgm.tGameItem.getItemCharacteristic(item);
      const iconName = characteristic.pattern[1];
      iconCountMap0.set(iconName, (iconCountMap0.get(iconName) ?? 0) + 1);
    }
    for (const category in equips) {
      for (const itemId in equips[category]) {
        const item = tWgm.tGameItem.createEquipment({
          itemId,
          isShikibetsu: true,
          isNoroi: false,
        });

        const characteristic = tWgm.tGameItem.getItemCharacteristic(
          item,
        );
        const iconName = characteristic.pattern[1];
        iconCountMap0.set(
          iconName,
          (iconCountMap0.get(iconName) ?? 0) + 1,
        );
      }
    }

    for (const [itemId, num] of this.kanteiFilter) {
      const item = (() => {
        const item = tWgm.tGameItem.createItem({
          itemId,
          isShikibetsu: true,
          isNoroi: false,
        });

        if (item) return item;

        const equipment = tWgm.tGameItem.createEquipment({
          itemId,
          isShikibetsu: true,
          isNoroi: false,
        });

        if (equipment) return equipment;

        return undefined;
      })();

      if (item) {
        const characteristic = tWgm.tGameItem.getItemCharacteristic(
          item,
        );
        const iconName = characteristic.pattern[1];
        iconCountMap1.set(
          iconName,
          (iconCountMap1.get(iconName) ?? 0) + 1,
        );
        iconMaxNumMap.set(
          iconName,
          Math.max(num, iconMaxNumMap.get(iconName) ?? 0),
        );
        continue;
      }
    }

    for (const [itemId, _num] of this.kanteiFilter) {
      const item = (() => {
        const item = tWgm.tGameItem.createItem({
          itemId,
          isShikibetsu: true,
          isNoroi: false,
        });

        if (item) return item;

        const equipment = tWgm.tGameItem.createEquipment({
          itemId,
          isShikibetsu: true,
          isNoroi: false,
        });

        if (equipment) return equipment;

        return undefined;
      })();

      if (item) {
        const characteristic = tWgm.tGameItem.getItemCharacteristic(
          item,
        );
        const iconName = characteristic.pattern[1];
        const iconCount0 = iconCountMap0.get(iconName) ?? 0;
        const iconCount1 = iconCountMap1.get(iconName) ?? 0;
        if (iconCount0 === iconCount1) {
          const maxNum = iconMaxNumMap.get(iconName) ?? 0;
          mikanteiFilter.set(itemId, maxNum);
        }
      }
    }

    for (const [_name, num] of this.askillBookFilter) {
      if (num <= 0) continue;
      mikanteiFilter.delete("140001");
      break;
    }

    return mikanteiFilter;
  }

  private getData(): string {
    return this.globalData + "\n" + this.localData;
  }
}

async function loadGlobalData(): Promise<string> {
  const data = await maginai.loadJsData(
    "../save/auto_pickup_filter.js",
  );
  return typeof data === "string" ? data : "";
}

async function loadLocalData(saveNumber: number): Promise<string> {
  const data = await maginai.loadJsData(
    `../save/auto_pickup_filter_${saveNumber}.js`,
  );
  return typeof data === "string" ? data : "";
}

async function existsIncorrectLocalData(
  saveNumber: number,
): Promise<boolean> {
  try {
    await maginai.loadJsData(
      `../save/auto_pickup_filter${saveNumber}.js`,
    );
    return true;
  } catch (_error) {
    return false;
  }
}

export { AutoPickupFilter };
