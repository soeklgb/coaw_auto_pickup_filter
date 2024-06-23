## CoAW Auto pickup filter Mod

[English](./README_en.md) | [日本語](./README.md)

This is a mod that allows you to set filters for the auto-pickup feature of the Creator of Another World.

## Install

To use this mod, you need to install [maginai](https://github.com/Spoonail-Iroiro/maginai) first.

After installing maginai, download the mod from the [Release page](https://github.com/soeklgb/coaw_auto_pickup_filter/releases) and add it to the game following the instructions for using maginai.

## How to Use

Create a file named auto_pickup_filter.js in the folder containing the save data for Creator of Another World, and write your settings in it.

For Windows users, please ensure that file extensions are visible before creating the file.

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

`auto_pickup_filter.js` is loaded when the game starts.

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
