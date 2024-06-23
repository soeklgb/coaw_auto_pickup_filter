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
  const setEtcItem2 = (kind: string, ranges: [number, number][]) => {
    const names = [];
    for (const [min, max] of ranges) {
      for (let i = min; i <= max; i++) {
        const item = tWgm.tGameItem.masterData.etcitems[i];
        if (item === undefined) continue;
        names.push(i.toString());
      }
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
    map.set("すべて", names);
  }

  setItem2("薬", [
    [10000, 10817],
    [10901, 15004],
  ]);
  setItem("ポーション", 10000, 10334);
  setItem("HPポーション", 10000, 10004);
  setItem("MPポーション", 10100, 10104);
  setItem("SPポーション", 10200, 10204);
  setItem("HP割合ポーション", 10301, 10304);
  setItem("MP割合ポーション", 10311, 10314);
  setItem("SP割合ポーション", 10321, 10324);
  setItem("複合割合ポーション", 10331, 10334);
  setItem("割合ポーション", 10301, 10334);
  setItem("状態治療薬", 10718, 10721);
  setItem("活性剤", 10813, 10815);
  setItem("付与水", 10901, 10906);
  setItem("魔法水", 10921, 10929);
  setItem("ギフト", 15020, 15050);
  setItem("巻物", 20000, 20038);
  setItem("宝玉", 30000, 30033);
  setItem2("すべてのかけら", [
    [40001, 40152],
    [41001, 41152],
    [42001, 42152],
  ]);
  setItem("小さいかけら", 40001, 40152);
  setItem("かけら", 41001, 41152);
  setItem("大きなかけら", 42001, 42152);
  setItem("肥料", 50001, 50013);

  setEtcItem("種", 110001, 110038);
  setEtcItem("料理", 120085, 120115);
  setEtcItem("ジュース", 120085, 120085);
  setEtcItem2("サラダ", [
    [120086, 120086],
    [120095, 120095],
  ]);
  setEtcItem("ドライ", 120087, 120087);
  setEtcItem("アイス", 120088, 120088);
  setEtcItem("プリン", 120089, 120089);
  setEtcItem("ケーキ", 120090, 120090);
  setEtcItem("フレーク", 120091, 120091);
  setEtcItem("ミルク煮", 120092, 120092);
  setEtcItem("シチュー", 120093, 120093);
  setEtcItem("素焼き", 120094, 120094);
  setEtcItem("鍋", 120096, 120096);
  setEtcItem("炒め", 120097, 120097);
  setEtcItem("ポテト", 120098, 120098);
  setEtcItem("天ぷら", 120099, 120099);
  setEtcItem("パン", 120100, 120100);
  setEtcItem("サンドイッチ", 120101, 120101);
  setEtcItem("ハンバーガー", 120102, 120102);
  setEtcItem("オムレツ", 120103, 120103);
  setEtcItem("親子丼", 120104, 120104);
  setEtcItem("茶碗蒸し", 120105, 120105);
  setEtcItem("うどん", 120106, 120106);
  setEtcItem("ピザ", 120107, 120107);
  setEtcItem("お好み焼き", 120108, 120108);
  setEtcItem("燻製", 120109, 120109);
  setEtcItem("ステーキ", 120110, 120110);
  setEtcItem("お造り", 120111, 120111);
  setEtcItem("竜田揚げ", 120112, 120112);
  setEtcItem("失敗作", 120114, 120115);
  setEtcItem("魚", 120117, 120136);
  setEtcItem("肉", 120200, 120203);
  setEtcItem("調味料", 130001, 130006);
  setEtcItem("スキル書", 140001, 140001);
  setEtcItem("犯罪アイテム", 200001, 200025);
  setEtcItem("釣り竿", 200111, 200113);
  setEtcItem("旗印", 200201, 200208);
  setEtcItem("配達物", 200501, 200505);
  setEtcItem("技能書", 201001, 201004);
  setEtcItem("素材", 501001, 501016);
  setEtcItem("製法書", 610000, 615006);
  setEtcItem("鉱石", 1000001, 1000009);
  setEtcItem("結晶", 1101001, 1101002);
  setEtcItem("宝石", 1200001, 1200004);

  setEquips("装備", [
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
  setEquips("剣", 1001);
  setEquips("斧", 1002);
  setEquips("棍", 1003);
  setEquips("拳", 1004);
  setEquips("突剣", 1005);
  setEquips("槍", 1006);
  setEquips("ロッド", 1007);
  setEquips("弓", 2001);
  setEquips("銃", 2002);
  setEquips("投擲", 2003);
  setEquips("盾", 3001);
  setEquips("帽子", 4001);
  setEquips("兜", 4002);
  setEquips("服", 4003);
  setEquips("鎧", 4004);
  setEquips("ローブ", 4005);
  setEquips("腕装備", [4006, 4007]);
  setEquips("足装備", [4008, 4009]);
  setEquips("アクセサリ", 4010);

  return map;
}

export { createItemKindToIdMap };
export type { ItemKindToIdMap };
