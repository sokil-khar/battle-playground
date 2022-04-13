import { DB } from './database';
import { v4 as uuidv4 } from 'uuid';

export function useAddBattlefly() {
  const addBattlefly = async (battlefly) => {
    const item = {
      id: uuidv4(),
      ...battlefly,
    };

    const itemId = await DB.battleflies.add(item);

    return DB.battleflies.get(itemId);
  };

  return addBattlefly;
}
