import { DB } from './database';

export function useSaveBattleflyTraits() {
  const saveBattleflyTraits = async (battleflyId, traits) => {
    await DB.battleflies.update(battleflyId, { traits });

    const updatedBattlefly = await DB.battleflies.get(battleflyId);
    const traitList = await DB.traits.toArray();

    return updatedBattlefly.traits.map((traitId) =>
      traitList.find((trait) => trait.id === traitId)
    );
  };

  return saveBattleflyTraits;
}
