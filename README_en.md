## CoAW Auto pickup filter Mod

[English](./README_en.md) | [日本語](./README.md)

[![GitHub Release](https://img.shields.io/github/v/release/soeklgb/coaw_auto_pickup_filter)](https://github.com/soeklgb/coaw_auto_pickup_filter/releases/latest)
[![GitHub License](https://img.shields.io/github/license/soeklgb/coaw_auto_pickup_filter)](https://github.com/soeklgb/coaw_auto_pickup_filter/blob/main/LICENSE)

This is a mod that allows you to set filters for the auto-pickup feature of the Creator of Another World.
By setting filters, you can customize the types and quantities of items to be picked up according to your preferences.

## Install

To use this mod, you need to install [maginai](https://github.com/Spoonail-Iroiro/maginai) first.

After installing maginai, download the mod from the [Release page](https://github.com/soeklgb/coaw_auto_pickup_filter/releases/latest) and add it to the game following the instructions for using maginai.

## Configuration file

Create a file named auto_pickup_filter.js in the folder containing the save data for Creator of Another World, and write your settings in it.

- For the Steam version, create an `auto_pickup_filter.js` file in the `save` folder. You can access this folder by clicking on the `⚙️ (gear icon)` on the Creator of Another World's Steam library page, then selecting `Manage → Browse local files`.
- For the DLsite version, create an `auto_pickup_filter.js` file in the `save` folder located in the same directory as the `Game.exe` file.

For Windows users, please ensure that file extensions are visible before creating the file.

The `auto_pickup_filter.js` file is loaded when the game starts. If you make changes to `auto_pickup_filter.js` while the game is running, you'll need to restart the game for the new settings to take effect.

## How to Use

```js
LOADDATA = `
# Lines starting with "#" are comments
# Settings are loaded in order from top to bottom

# Pick up to 4 Potion of HP 50
4 Potion of HP 50

# Pick up to 2 Potion of HP 50 (overrides settings)
2 Potion of HP 50

# Don't pick up Scroll of Weakening
0 Scroll of Weapon Weakening
0 Scroll of Armor Weakening

# Pick up The Scroll of Weakening (cancel settings)
- Scroll of Weapon Weakening

# Pick up to four of each Healing meds (bulk settings)
4 Healing meds
`;
```

## Settings for Individual Save Data

You can add settings for each save data by appending a number to the end of the filename, such as `auto_pickup_filter_0.js`.

The number at the end corresponds to the save data file (.tbrg) and is one less than the number displayed in-game.

## Limitations

- The number of non-stackable items that can be picked up cannot be limited.
- When carrying a bag, it's not possible to filter items that can be placed inside it.
- Individual dishes cannot be filtered separately.

## List of Bulk Setting Keywords

```txt
All
Drug
Potion
Potion of HP
Potion of MP
Potion of SP
Potion of %
Potion of HP%
Potion of MP%
Potion of SP%
Complex Potion%
Healing meds
Activator
Sap
Bonus DEF liquid
Gift
Scroll
Jewel
All fragments
Small fragment
Fragment
Big fragment
Nutrient
Seed
Dish
Fish
Meat
Seasoning
Skill book
Criminal items
Fishing rod
Banner
Delivery item
Ability book
Material
Recipe
Ore
Crystal
Gem
Equipment
Sword
Axe
Blunt
Fists
Piercing
Spear
Rod
Bow
Gun
Throwing
Shield
Headgear
Headpiece
Clothes
Armor
Robe
Gloves
Gauntlets
Footwear
Leg armor
Accessory
```

## Contact

If you encounter any problems or have questions, please create a new [Issue](https://github.com/soeklgb/coaw_auto_pickup_filter/issues) in this repository.