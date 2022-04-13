import { useEffect, useState } from 'react';
import { DB } from './database';

export async function getBattlefly(battleflyId) {
  const battlefly = await DB.battleflies.get(battleflyId);

  const mods = await DB.mods.toArray();
  const traits = await DB.traits.toArray();
  const fractions = await DB.fractions.toArray();

  if (battlefly.modSets) {
    battlefly.modSets = battlefly.modSets.map((item) => ({
      name: item.name,
      mods: item.mods.map?.((modId) => mods.find((mod) => mod.id === modId)),
    }));
  } else {
    battlefly.modSets = [];
  }

  if (battlefly.traits) {
    battlefly.traits = battlefly.traits
      .filter(Boolean)
      .map((traitId) => traits.find((trait) => trait.id === traitId));
  } else {
    battlefly.traits = [];
  }

  if (battlefly.fraction) {
    battlefly.fraction = fractions.find((fraction) => fraction.id === battlefly.fraction);

    if (battlefly.fraction) {
      battlefly.fraction.trait = await DB.traits.get(battlefly.fraction.trait);

      battlefly.traits = battlefly.traits.filter(Boolean).concat(battlefly.fraction.trait);
    }
  }

  battlefly.level = battlefly.level || 1;

  battlefly.characteristics = battlefly.characteristics || {
    sensorsArray: 0,
    fusionBattery: 0,
    nanoFrame: 0,
    engines: 0,
    cpu: 0,
  };

  return battlefly;
}

export const useBattlefly = (battleflyId) => {
  const [battlefly, setBattlefly] = useState(null);

  useEffect(() => {
    (async () => {
      setBattlefly(await getBattlefly(battleflyId));
    })();
  }, [battleflyId]);

  const refetchBattlefly = async () => {
    setBattlefly(await getBattlefly(battleflyId));
  };

  return [battlefly, refetchBattlefly];
};
