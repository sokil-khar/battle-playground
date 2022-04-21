import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DB } from './database';

import fractions from '../data/fractions.json';
import traits from '../data/traits.json';
import mods from '../data/mods.json';
import battleflies from '../data/battleflies.json';
import oneStarBF from '../data/one-star.json';


import { effects } from '../effects';

import { getBattleflyStars, getNormalRating, ModType } from '../data/constants';
import { pickItem, pickItems, shuffle } from '../random';
import { uniqBy } from 'lodash';

function getDefaultCharacteristics() {
  return {
    cpu: 0,
    engines: 0,
    fusionBattery: 0,
    nanoFrame: 0,
    sensorsArray: 0
  }
}

function getDefaultStats() {
  return {
    hp: 400,
    hprg: 0,
    arm: 0,
    shp: 200,
    shrg: 1,
    eva: 5,
    crit: 5,
    loot: 0,
    xpr: 0,
    bat: 100,
    dcrit: 200,
    rcrit: 5
  };
}
function weaponBonus()
{
  return {
    Kinetic: 0,
    Energy: 0,
    Missile: 0,
    Electric: 0,
    Nuclear: 0
  }
}
function findMods(mods, list) {
  return mods.map(mod => list.find(item => item.name === mod)?.id).filter(Boolean);
}

function randomizeMods(list) {
  const weapons = list.filter(item => item.type === 'Weapon');
  const utilities = list.filter(item => item.type === "Utility");
  const defenses = list.filter(item => item.type === 'Defense');

  return pickItems(weapons, 2).concat(pickItems(utilities, 1))
      .concat(pickItems(defenses, 1)).map(item => item.id)
}

function generateTraits(traits, rarity) {
  const table = {
    'Common': 0,
    'Uncommon': 1,
    'Rare': 2,
    'Epic': 3,
    'Legendary': 3
  }

  const count = table[rarity];
  const result = [];

  let myTraits = traits;
  while(result.length !== count) {
    const trait = pickItems(myTraits, 1);

    result.push(...trait.map(item => item.id));

    myTraits = myTraits.filter(item => item.id !== trait.id);
  }
  if(rarity === 'Legendary') {
    result.push(...pickItems(traits, 2).map(item => item.id));
  }
  return result;
}

function generateFraction(list) {
  return pickItem(list).id;
}

function generateRarity() {
  return pickItem(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);
}

function getBattlefly(battlefly, fractions, traits, mods) {
  const name = battlefly.name;
  // no generate fractions
  // const fraction = battlefly.fraction ? (String(fractions.find(fraction => fraction.name === battlefly.fraction)?.id) || null) : generateFraction(fractions);

  const rarity = battlefly.rarity || generateRarity();

  const modes = battlefly.modSets ? findMods(battlefly.modSets[0].mods, mods) : randomizeMods(mods);
  const trait = !battlefly.traits ? generateTraits(traits, rarity) : battlefly.traits;

  return {
    id: uuidv4(),
    name,
    // fraction,
    level: 1,
    rarity,
    iconic: !battlefly.plain,
    stats: getDefaultStats(),
    characteristics: getDefaultCharacteristics(),
    traits: trait.map(String),
    weaponbonus: weaponBonus(),
    modSets: [{ name: 'default', mods: modes }]
  }
}

export function useInitializeData() {
  const getKeys = () => DB.metadata.toArray();

  const addKey = (key, value) => DB.metadata.add({ key, value });

  const hasKey = (keys, key) => {
    return keys.find((item) => item.key === key && item.value);
  };

  const initialize = useCallback(async () => {
    const keys = await getKeys();

    if (!hasKey(keys, 'fractionsInitialized')) {
      await DB.fractions.bulkAdd(fractions);

      await addKey('fractionsInitialized', true);
    }

    if (!hasKey(keys, 'traitsInitialized')) {
      await DB.traits.bulkAdd(traits);

      await addKey('traitsInitialized', true);
    }

    const m = mods.map(toMod)
    if (!hasKey(keys, 'modsInitialized')) {
      await DB.mods.bulkAdd(m);

      await addKey('modsInitialized', true);
    }

    if (!hasKey(keys, 'battlefliesInitialized')) {
      const iconics = battleflies.slice(0, 10).map(item => getBattlefly(item, fractions, traits, m));

      const twoStar = [];
      const threeStar = [];
      const fourStar = [];
      const fiveStar = [];

      while(true) {
        const bf = getBattlefly({ name: `Alpha BF`, plain: true }, fractions, traits, m);
        const mods = bf.modSets[0].mods.map(modId => m.find(item => item.id === modId));

        const stars = getBattleflyStars(getNormalRating(bf, mods));

        if(stars === 2  && twoStar.length < 20) {
          twoStar.push(bf);
        } else if(stars === 3  && threeStar.length < 30) {
          threeStar.push(bf)
        } else if(stars === 4  && fourStar.length < 20) {
          fourStar.push(bf)
        } else if(stars === 5  && fiveStar.length < 10) {
          fiveStar.push(bf);
        }

        if(twoStar.length < 20) continue;
        if(threeStar.length < 30) continue;
        if(fourStar.length < 20) continue;
        if(fiveStar.length < 10) continue;

        break;
      }

      const oneStar = shuffle(uniqBy(oneStarBF, 'id')).slice(0, 10).map((item, idx) => {
        item.modSets[0].mods = item.modSets[0].mods.map(modName => m.find(item => item.name === modName)?.id).filter(Boolean);

        return item;
      });

      const allBattleflies = [].concat(oneStar, twoStar, threeStar, fourStar, fiveStar).map((item, idx) => {
        item.name = `Alpha BF #${idx + 1}`;

        return item;
      }).concat(iconics).map(item => {
        item.id = uuidv4();

        return item;
      });

      await DB.battleflies.bulkAdd(allBattleflies);

      await addKey('battlefliesInitialized', true);
    }

    if (!hasKey(keys, 'effectsInitialized')) {
      const mods = await DB.mods.toArray();
      const updates = mods.map((item) => ({
        ...item,
        effects: effects.find((e) => e.name === item.name)?.effects || [],
      }));

      await DB.mods.bulkPut(updates);

      await addKey('effectsInitialized', true);
    }
  }, []);

  return initialize;
}

function toMod(item) {
  const type = item['Weapon Name']
    ? ModType.Weapon
    : item['Mod Name']
    ? ModType.Defense
    : ModType.Utility;

  const mod = {
    id: uuidv4(),
    rarity: item['Rarity'] || item['Starting Rarity'],
    type,
  };

  if (type === ModType.Weapon) {
    return {
      name: item['Weapon Name'],
      ...mod,
      data: {
        damageType: item['Damage Type'],
        fireRate: parseFloat(item['Fire Rate']) || 0,
        reload: parseFloat(item['Reload']) || 0,
        damagePerFire: parseFloat(item['Damage per Fire'] || item['Damage Per Fire']) || 0,
      },
    };
  }

  return {
    name: item['Mod Name'] || item['Name'],
    ...mod,
    data: {
      shp: parseFloat(item['Initial Shield Value']) || 0,
      arm: parseFloat(item['Initial Armor Value']) || 0,
    },
  };
}
