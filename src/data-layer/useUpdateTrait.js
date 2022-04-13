import { DB } from './database';

export function useUpdateTrait() {
  const updateTrait = async (traitId, trait) => {
    await DB.traits.update(traitId, trait);
  };

  return updateTrait;
}
