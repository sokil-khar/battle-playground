import { DB } from './database';
import { v4 as uuidv4 } from 'uuid';

export function useAddTrait() {
  const addTrait = async (trait) => {
    const item = {
      id: uuidv4(),
      ...trait,
    };
    const itemId = await DB.traits.add(item);

    return DB.traits.get(itemId);
  };

  return addTrait;
}
