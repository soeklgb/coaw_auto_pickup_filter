# 異世界の創造者 自動拾いフィルターMod

異世界の創造者の自動拾いをフィルターすることができるModです。

## 導入

このModを使うには[maginai](https://github.com/Spoonail-Iroiro/maginai)の導入が必要です。
maginaiを導入したらReleaseページからModをダウンロードしてmaginaiの使い方に従ってゲームにModを追加してください。

## 使い方

異世界の創造者のセーブデータがあるフォルダに`auto_pickup_filter.js`を作成して設定を書き込みます。
Windowsの場合、拡張子を表示する設定にしてからファイルを作成してください。

```js
LOADDATA = `
# "#"から始まる行はコメントです
# 設定は上から順番に読み込まれます

# HPポーション50を4個まで拾う
4 HPポーション50

# HPポーション50を2個まで拾う（設定の上書き）
2 HPポーション50

# 弱化の巻物を拾わない
0 武器弱化の巻物
0 防具弱化の巻物

# 武器弱化の巻物を拾う（設定の取り消し）
- 武器弱化の巻物

# 状態治療薬をそれぞれ4個まで拾う（一括設定）
4 状態治療薬
`;
```

`auto_pickup_filter.js`はゲーム起動時に読み込まれます。

## セーブデータごとの設定

`auto_pickup_filter_0.js`のように末端に番号を付けることでセーブデータごとに設定を追加できます。
末端の番号はセーブデータファイル(.tbrg)と同じで、ゲーム内の表記より1少ない数値です。

## 制限

スタックされないアイテムは拾う数を制限できません。

ふくろを持っているとき、ふくろに入るアイテムはフィルターできません。

料理は個別にフィルタできません。

## 一括設定ワード一覧

すべて, 薬, ポーション, HPポーション, MPポーション, SPポーション, HP割合ポーション, MP割合ポーション, SP割合ポーション, 複合割合ポーション, 割合ポーション, 状態治療薬, 活性剤, 付与水, 魔法水, ギフト, 巻物, 宝玉, すべてのかけら, 小さいかけら, かけら, 大きなかけら, 肥料, 種, 料理, ジュース, サラダ, ドライ, アイス, プリン, ケーキ, フレーク, ミルク煮, シチュー, 素焼き, 鍋, 炒め, ポテト, 天ぷら, パン, サンドイッチ, ハンバーガー, オムレツ, 親子丼, 茶碗蒸し, うどん, ピザ, お好み焼き, 燻製, ステーキ, お造り, 竜田揚げ, 失敗作, 魚, 肉, 調味料, スキル書, 犯罪アイテム, 釣り竿, 旗印, 配達物, 技能書, 素材, 製法書, 鉱石, 結晶, 宝石, 装備, 剣, 斧, 棍, 拳, 突剣, ロッド, 弓, 銃, 投擲, 盾, 帽子, 兜, 服, 鎧, ローブ, 腕装備, 足装備, アクセサリ