import { DB } from './database';

export function useAddBattleflyModSet() {
  const addBattleflyModSet = async (battleflyId, modSet) => {
    const newMods = modSet.mods.map((mod) => mod.id);

    const battlefly = await DB.battleflies.get(battleflyId);
    let currentModSets = battlefly.modSets || [];

    const isExists = currentModSets.find((item) => item.name === modSet.name);
    if (isExists) {
      isExists.mods = newMods;
    } else {
      currentModSets = currentModSets.concat([
        {
          name: modSet.name,
          mods: newMods,
        },
      ]);
    }

    await DB.battleflies.update(battleflyId, {
      modSets: currentModSets,
    });

    const updatedBattlefly = await DB.battleflies.get(battleflyId);
    const mods = await DB.mods.toArray();

    return updatedBattlefly.modSets.map((item) => ({
      name: item.name,
      mods: item.mods.map((modId) => mods.find((mod) => mod.id === modId)),
    }));
  };

  return addBattleflyModSet;
}
