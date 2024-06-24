type IconNameToIdMap = Map<string, string[]>;

function createIconNameToIdMap(): IconNameToIdMap | undefined {
  if (tWgm.version === undefined) return undefined;

  const map = new Map<string, string[]>();

  const items = tWgm.tGameItem.masterData.items;
  const etcitems = tWgm.tGameItem.masterData.etcitems;
  const askills = tWgm.tGameSkillAction.askillData.askills;
  const equips = tWgm.tGameItem.masterData.equips;

  for (const itemId in items) {
    const item = tWgm.tGameItem.createItem({
      itemId,
      isShikibetsu: true,
      isNoroi: false,
    });
    const characteristic = tWgm.tGameItem.getItemCharacteristic(item);
    const iconName = characteristic.pattern[1];
    const pickupIds = map.get(iconName) ?? [];
    pickupIds.push(itemId);
    map.set(iconName, pickupIds);
  }
  for (const itemId in etcitems) {
    if (itemId === "140001") continue;

    const item = tWgm.tGameItem.createItem({
      itemId,
      isShikibetsu: true,
      isNoroi: false,
    });
    const characteristic = tWgm.tGameItem.getItemCharacteristic(item);
    const iconName = characteristic.pattern[1];
    const pickupIds = map.get(iconName) ?? [];
    pickupIds.push(itemId);
    map.set(iconName, pickupIds);
  }
  for (const skillId in askills) {
    const iconName = "book";
    const pickupIds = map.get(iconName) ?? [];
    pickupIds.push("140001:" + skillId);
    map.set(iconName, pickupIds);
  }
  for (const category in equips) {
    for (const itemId in equips[category]) {
      const item = tWgm.tGameItem.createEquipment({
        itemId,
        isShikibetsu: true,
        isNoroi: false,
      });
      const characteristic = tWgm.tGameItem.getItemCharacteristic(item);
      const iconName = characteristic.pattern[1];
      const pickupIds = map.get(iconName) ?? [];
      pickupIds.push(itemId);
      map.set(iconName, pickupIds);
    }
  }

  return map;
}

export { createIconNameToIdMap };
export type { IconNameToIdMap };
