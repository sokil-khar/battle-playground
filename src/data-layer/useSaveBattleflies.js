import { DB, BackupDB } from './database';
import isEqual from 'lodash/isEqual';
import { v4 as uuidv4 } from 'uuid';

const dC = {
  cpu: 0,
  engines: 0,
  nanoFrame: 0,
  fusionBattery: 0,
  sensorsArray: 0,
};

export function useSaveBattleflies() {
  const saveBattleflies = async () => {
    const battleflies = await DB.battleflies.toArray();
    const fractions = await DB.fractions.toArray();
    const traits = await DB.traits.toArray();
    const mods = await DB.mods.toArray();

    const getBattlefly = (battlefly) => ({
      characteristics: battlefly.characteristics || dC,
      level: battlefly.level || 1,
      name: battlefly.name,
      rarity: battlefly.rarity,
      stats: battlefly.stats,
      fractionName: fractions.find((fraction) => fraction.id === battlefly.fraction)?.name || null,
      modSets: battlefly.modSets?.map((modSet) => {
        return {
          name: modSet.name,
          mods: modSet.mods
            .map((modId) => mods.find((mod) => mod.id === modId)?.name || null)
            .filter(Boolean),
        };
      }),

      traits: battlefly.traits
        .map((traitId) => traits.find((trait) => trait.id === traitId))
        .filter(Boolean),
    });

    let count = await BackupDB.battleflies.count();

    // if (count >= 10) {
    //   await BackupDB.battleflies.where('id').between(1, 11).delete();

    //   count = 0;
    // }

    await BackupDB.battleflies.add({
      id: count + 1,
      data: battleflies.map(getBattlefly),
    });
  };

  const restoreBattleflies = async () => {
    const fractions = await DB.fractions.toArray();
    const traits = await DB.traits.toArray();
    const mods = await DB.mods.toArray();

    const map = new Map();

    traits.forEach((trait) => {
      const item = { ...trait };
      delete item.id;

      map.set(item, trait.id);
    });

    const backup = await BackupDB.battleflies.toArray();
    const battleflies = backup[backup.length - 1]?.data;

    if (!battleflies) {
      alert('There are no saved battleflies');
    }

    const getBattlefly = (battlefly) => ({
      id: uuidv4(),
      characteristics: battlefly.characteristics,
      level: battlefly.level,
      name: battlefly.name,
      rarity: battlefly.rarity,
      stats: battlefly.stats,
      fraction: fractions.find((fraction) => fraction.name === battlefly.fractionName)?.id || null,
      modSets: battlefly.modSets.map((modSet) => {
        return {
          name: modSet.name,
          mods: modSet.mods
            .map((modName) => mods.find((mod) => mod.name === modName)?.id || null)
            .filter(Boolean),
        };
      }),

      traits: battlefly.traits
        .map((trait) => {
          delete trait.id;

          for (const value of map.keys()) {
            if (isEqual(value, trait)) {
              return map.get(value);
            }
          }

          return null;
        })
        .filter(Boolean),
    });

    await DB.battleflies.clear();

    await DB.battleflies.bulkAdd(battleflies.map(getBattlefly));
  };

  return [saveBattleflies, restoreBattleflies];
}
