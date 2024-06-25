## 異世界の創造者 自動拾いフィルターMod

[English](./README_en.md) | [日本語](./README.md)

[![GitHub Release](https://img.shields.io/github/v/release/soeklgb/coaw_auto_pickup_filter)](https://github.com/soeklgb/coaw_auto_pickup_filter/releases/latest)
[![GitHub License](https://img.shields.io/github/license/soeklgb/coaw_auto_pickup_filter)](https://github.com/soeklgb/coaw_auto_pickup_filter/blob/main/LICENSE)

異世界の創造者の自動拾いにフィルターを設定できるModです。
フィルターを設定することで好みに応じて拾うアイテムの種類や数をカスタマイズできます。

## 導入

このModを使うには[maginai](https://github.com/Spoonail-Iroiro/maginai)の導入が必要です。

maginaiを導入したら[Releaseページ](https://github.com/soeklgb/coaw_auto_pickup_filter/releases/latest)からModをダウンロードしてmaginaiの使い方に従ってゲームにModを追加してください。

## 設定ファイル

異世界の創造者のセーブデータがあるフォルダに`auto_pickup_filter.js`を作成して設定を書き込みます。

- Steam版の場合、Steamライブラリの異世界の創造者のページで`⚙️(歯車のマーク)`をクリックして`管理 → ローカルファイルを閲覧`を選択すると開くフォルダにある`save`フォルダに`auto_pickup_filter.js`を作成します。
- DLsite版の場合、`Game.exe`があるフォルダにある`save`フォルダに`auto_pickup_filter.js`を作成します。

OSがWindowsの場合、拡張子を表示する設定にしてからファイルを作成してください。

`auto_pickup_filter.js`はゲーム起動時に読み込まれます。ゲーム実行中に`auto_pickup_filter.js`を変更した場合はゲームを再起動すると新しい設定に更新されます。

## 使い方

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

## セーブデータごとの設定

`auto_pickup_filter_0.js`のように末端に番号を付けることでセーブデータごとに設定を追加できます。
末端の番号はセーブデータファイル(.tbrg)と同じで、ゲーム内の表記より1少ない数値です。

## 制限事項

- スタックされないアイテムは拾う数を制限できません。
- 袋を持っているとき、袋に入るアイテムはフィルターできません。
- 料理は個別にフィルタできません。

## 一括設定ワード一覧

```txt
すべて
薬
ポーション
HPポーション
MPポーション
SPポーション
割合ポーション
HP割合ポーション
MP割合ポーション
SP割合ポーション
複合割合ポーション
状態治療薬
活性剤
付与水
魔法水
ギフト
巻物
宝玉
すべてのかけら
小さいかけら
かけら
大きなかけら
肥料
種
料理
魚
肉
調味料
スキル書
犯罪アイテム
釣り竿
旗印
配達物
技能書
素材
製法書
鉱石
結晶
宝石
装備
剣
斧
棍
拳
突剣
槍
ロッド
弓
銃
投擲
盾
帽子
兜
服
鎧
ローブ
腕
腕鎧
足
足鎧
アクセサリ
```

## コンタクト

問題が発生した場合や質問がある場合はこのリポジトリに新しい[Issue](https://github.com/soeklgb/coaw_auto_pickup_filter/issues)を作成してください。