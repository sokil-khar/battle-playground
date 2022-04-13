import { DB } from './database';

export function useSaveBattleflyCharacteristics() {
  const saveBattleflyCharacteristics = async (battleflyId, characteristics) => {
    await DB.battleflies.update(battleflyId, { characteristics });
  };

  return saveBattleflyCharacteristics;
}
