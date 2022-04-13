import { DB } from './database';

export function useUpdateBattlefly() {
  const updateBattlefly = async (battleflyId, battlefly) => {
    if (battlefly.traits) {
      delete battlefly.traits;
    }

    if (battlefly.modSets) {
      delete battlefly.modSets;
    }

    if (battlefly.characteristics) {
      delete battlefly.characteristics;
    }

    await DB.battleflies.update(battleflyId, battlefly);
  };

  return updateBattlefly;
}
