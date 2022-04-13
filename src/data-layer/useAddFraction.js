import { DB } from './database';
import { v4 as uuidv4 } from 'uuid';

export function useAddFraction() {
  const addTrait = async (fraction) => {
    const item = {
      id: uuidv4(),
      ...fraction,
    };
    const itemId = await DB.fractions.add(item);

    return DB.fractions.get(itemId);
  };

  return addTrait;
}
