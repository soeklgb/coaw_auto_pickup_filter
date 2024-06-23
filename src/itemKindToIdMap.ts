import { getText } from "./language.ts";

type ItemKindToIdMap = Map<string, string[]>;

function createItemKindToIdMap(): ItemKindToIdMap | undefined {
  if (tWgm.version === undefined) return undefined;

  const map = new Map<string, string[]>();

  const setItem = (kind: string, min: number, max: number) => {
    const names = [];
    for (let i = min; i <= max; i++) {
      const item = tWgm.tGameItem.masterData.items[i];
      if (item === undefined) continue;
      names.push(i.toString());
    }
    map.set(kind, names);
  };
  const setItem2 = (kind: string, ranges: [number, number][]) => {
    const names = [];
    for (const [min, max] of ranges) {
      for (let i = min; i <= max; i++) {
        const item = tWgm.tGameItem.masterData.items[i];
        if (item === undefined) continue;
        names.push(i.toString());
      }
    }
    map.set(kind, names);
  };

  const setEtcItem = (kind: string, min: number, max: number) => {
    const names = [];
    for (let i = min; i <= max; i++) {
      const item = tWgm.tGameItem.masterData.etcitems[i];
      if (item === undefined) continue;
      names.push(i.toString());
    }
    map.set(kind, names);
  };

  const setEquips = (
    kind: string,
    category: number | number[],
  ) => {
    if (Array.isArray(category)) {
      const names = [];
      for (const c of category) {
        const items = tWgm.tGameItem.masterData.equips[c];
        for (const itemId in items) {
          names.push(itemId);
        }
      }
      map.set(kind, names);
    } else {
      const names = [];
      const items = tWgm.tGameItem.masterData.equips[category];
      for (const itemId in items) {
        names.push(itemId);
      }
      map.set(kind, names);
    }
  };

  {
    const names = [];
    for (const itemId in tWgm.tGameItem.masterData.items) {
      names.push(itemId);
    }
    for (const itemId in tWgm.tGameItem.masterData.etcitems) {
      names.push(itemId);
    }
    for (const category in tWgm.tGameItem.masterData.equips) {
      for (const itemId in tWgm.tGameItem.masterData.equips[category]) {
        names.push(itemId);
      }
    }
    map.set(getText("kind.all"), names);
  }

  setItem2(getText("kind.drug"), [
    [10000, 10817],
    [10901, 15004],
  ]);
  setItem(getText("kind.potion"), 10000, 10334);
  setItem(getText("kind.potion_of_hp"), 10000, 10004);
  setItem(getText("kind.potion_of_mp"), 10100, 10104);
  setItem(getText("kind.potion_of_sp"), 10200, 10204);
  setItem(getText("kind.potion_of_%"), 10301, 10334);
  setItem(getText("kind.potion_of_hp%"), 10301, 10304);
  setItem(getText("kind.potion_of_mp%"), 10311, 10314);
  setItem(getText("kind.potion_of_sp%"), 10321, 10324);
  setItem(getText("kind.complex_postion%"), 10331, 10334);
  setItem(getText("kind.healing_meds"), 10718, 10721);
  setItem(getText("kind.activator"), 10813, 10815);
  setItem(getText("kind.sap"), 10901, 10906);
  setItem(getText("kind.bonus_def_liquid"), 10921, 10929);
  setItem(getText("kind.gift"), 15020, 15050);
  setItem(getText("kind.scroll"), 20000, 20038);
  setItem(getText("kind.jewel"), 30000, 30033);
  setItem2(getText("kind.all_frangments"), [
    [40001, 40152],
    [41001, 41152],
    [42001, 42152],
  ]);
  setItem(getText("kind.small_fragment"), 40001, 40152);
  setItem(getText("kind.fragment"), 41001, 41152);
  setItem(getText("kind.big_fragment"), 42001, 42152);
  setItem(getText("kind.nutrient"), 50001, 50013);

  setEtcItem(getText("kind.seed"), 110001, 110038);
  setEtcItem(getText("kind.dish"), 120085, 120115);
  setEtcItem(getText("kind.fish"), 120117, 120136);
  setEtcItem(getText("kind.meat"), 120200, 120203);
  setEtcItem(getText("kind.seasoning"), 130001, 130006);
  setEtcItem(getText("kind.skill_book"), 140001, 140001);
  setEtcItem(getText("kind.criminal_items"), 200001, 200025);
  setEtcItem(getText("kind.fishing_rod"), 200111, 200113);
  setEtcItem(getText("kind.banner"), 200201, 200208);
  setEtcItem(getText("kind.delivery_item"), 200501, 200505);
  setEtcItem(getText("kind.ability_book"), 201001, 201004);
  setEtcItem(getText("kind.material"), 501001, 501016);
  setEtcItem(getText("kind.recipe"), 610000, 615006);
  setEtcItem(getText("kind.ore"), 1000001, 1000009);
  setEtcItem(getText("kind.crystal"), 1101001, 1101002);
  setEtcItem(getText("kind.gem"), 1200001, 1200004);

  setEquips(getText("kind.equipment"), [
    1001,
    1002,
    1003,
    1004,
    1005,
    1006,
    1007,
    2001,
    2002,
    2003,
    3001,
    4001,
    4002,
    4003,
    4004,
    4005,
    4006,
    4007,
    4008,
    4009,
    4010,
  ]);
  setEquips(getText("kind.sword"), 1001);
  setEquips(getText("kind.axe"), 1002);
  setEquips(getText("kind.blunt"), 1003);
  setEquips(getText("kind.fists"), 1004);
  setEquips(getText("kind.piercing"), 1005);
  setEquips(getText("kind.spear"), 1006);
  setEquips(getText("kind.rod"), 1007);
  setEquips(getText("kind.bow"), 2001);
  setEquips(getText("kind.gun"), 2002);
  setEquips(getText("kind.throwing"), 2003);
  setEquips(getText("kind.shield"), 3001);
  setEquips(getText("kind.headgear"), 4001);
  setEquips(getText("kind.headpiece"), 4002);
  setEquips(getText("kind.clothes"), 4003);
  setEquips(getText("kind.armor"), 4004);
  setEquips(getText("kind.robe"), 4005);
  setEquips(getText("kind.gloves"), 4006);
  setEquips(getText("kind.gauntlets"), 4007);
  setEquips(getText("kind.footwear"), 4008);
  setEquips(getText("kind.leg_armor"), 4009);
  setEquips(getText("kind.accessory"), 4010);

  return map;
}

export { createItemKindToIdMap };
export type { ItemKindToIdMap };
