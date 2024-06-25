import maginai from "maginai";
import * as _maginai_game_types from "maginai-game-types";
import { createIconNameToIdMap, IconNameToIdMap } from "./iconNameToIdMap.ts";
import { createItemKindToIdMap, ItemKindToIdMap } from "./itemKindToIdMap.ts";
import { createItemNameToIdMap, ItemNameToIdMap } from "./itemNameToIdMap.ts";
import { getText } from "./language.ts";
import { logger } from "./logger.ts";
import * as parser from "./parser.ts";
import {
  createSkillNameToIdMap,
  SkillNameToIdMap,
} from "./skillNameToIdMap.ts";
import { extractSkillNameFromSkillBookName } from "./utils.ts";

class AutoPickupFilter {
  private pickupIdToLimitMap: Map<string, number>;

  private itemKindToIdMap: ItemKindToIdMap;
  private itemNameToIdMap: ItemNameToIdMap;
  private skillNameToIdMap: SkillNameToIdMap;
  private iconNameToIdMap: IconNameToIdMap;

  private globalData: string;
  private localData: string;

  constructor() {
    this.pickupIdToLimitMap = new Map();

    this.itemKindToIdMap = new Map();
    this.itemNameToIdMap = new Map();
    this.skillNameToIdMap = new Map();
    this.iconNameToIdMap = new Map();

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

      const skillNameToIdMap = createSkillNameToIdMap();
      if (skillNameToIdMap !== undefined) {
        this.skillNameToIdMap = skillNameToIdMap;
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
            const iconName = args[0].object.data[2];

            const pickupId = (() => {
              if (isSkillBook) {
                const skillId = item[8][0];
                return "140001:" + skillId;
              } else {
                return itemId;
              }
            })();

            const limit = (() => {
              if (kantei) {
                return this.pickupIdToLimitMap.get(pickupId);
              } else {
                const pickupIds = this.iconNameToIdMap.get(iconName);
                if (pickupIds === undefined) return undefined;
                let maxLimit = 0;
                for (const pickupId of pickupIds) {
                  const limit = this.pickupIdToLimitMap.get(pickupId);
                  if (limit === undefined) return undefined;
                  maxLimit = Math.max(maxLimit, limit);
                }
                return maxLimit;
              }
            })();

            if (limit === undefined) return true;
            if (limit === 0) return false;

            const player = args[0].charactor;

            if (tWgm.tGameItem.getEnableGroupItem(item) === 1) {
              if (kantei) {
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
                    limit - nonCursedItemNum,
                  );
                } else {
                  desired = Math.max(
                    0,
                    limit - (nonCursedItemNum + cursedItemNum),
                  );
                }
                args[0].num = Math.min(args[0].num, desired);
              } else {
                let num = 0;
                for (const inventoryItem of player.items) {
                  if (tWgm.tGameItem.checkCompileItem(item, inventoryItem)) {
                    num = inventoryItem[10];
                    break;
                  }
                }
                const desired = Math.max(0, limit - num);
                args[0].num = Math.min(args[0].num, desired);
              }
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
      const iconNameToIdMap = createIconNameToIdMap();
      if (iconNameToIdMap !== undefined) {
        this.iconNameToIdMap = iconNameToIdMap;
      }

      const saveNumber = tWgm.tGameSave.saveNumber as number;

      (async () => {
        try {
          this.localData = await loadLocalData(saveNumber);
        } catch (_error) {
          // ローカルデータが存在しない

          this.localData = "";
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
          const pickupIds = [];

          {
            const itemIds = this.itemKindToIdMap.get(rule.value);
            if (itemIds !== undefined) {
              pickupIds.push(...itemIds);
            }
          }
          {
            const itemIds = this.itemNameToIdMap.get(rule.value);
            if (itemIds !== undefined) {
              pickupIds.push(...itemIds);
            }
          }
          {
            const skillName = extractSkillNameFromSkillBookName(rule.value);
            if (typeof skillName === "string") {
              const ids = this.skillNameToIdMap.get(skillName);
              if (ids !== undefined) {
                pickupIds.push(...ids);
              }
            }
          }

          for (const id of pickupIds) {
            this.pickupIdToLimitMap.delete(id);
          }

          break;
        }
        default: {
          const pickupIds = [];

          {
            const itemIds = this.itemKindToIdMap.get(rule.value);
            if (itemIds !== undefined) {
              pickupIds.push(...itemIds);
            }
          }
          {
            const itemIds = this.itemNameToIdMap.get(rule.value);
            if (itemIds !== undefined) {
              pickupIds.push(...itemIds);
            }
          }
          {
            const skillName = extractSkillNameFromSkillBookName(rule.value);
            if (typeof skillName === "string") {
              const ids = this.skillNameToIdMap.get(skillName);
              if (ids !== undefined) {
                pickupIds.push(...ids);
              }
            }
          }

          for (const id of pickupIds) {
            this.pickupIdToLimitMap.set(id, rule.prefix);
          }

          break;
        }
      }
    }
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
