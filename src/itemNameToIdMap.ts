type ItemNameToIdMap = Map<string, string[]>;

function createItemNameToIdMap(): ItemNameToIdMap | undefined {
  if (tWgm.version === undefined) return undefined;

  const map = new Map<string, string[]>();

  const items = tWgm.tGameItem.masterData.items;
  const etcitems = tWgm.tGameItem.masterData.etcitems;
  const equips = tWgm.tGameItem.masterData.equips;

  for (const itemId in items) {
    const item = items[itemId];
    const ids = map.get(item[1]) ?? [];
    ids.push(itemId);
    map.set(item[1], ids);
  }
  for (const itemId in etcitems) {
    const item = etcitems[itemId];
    const ids = map.get(item[1]) ?? [];
    ids.push(itemId);
    map.set(item[1], ids);
  }
  for (const category in equips) {
    for (const itemId in equips[category]) {
      const item = equips[category][itemId];
      const ids = map.get(item[0]) ?? [];
      ids.push(itemId);
      map.set(item[0], ids);
    }
  }

  return map;
}

export { createItemNameToIdMap };
export type { ItemNameToIdMap };
