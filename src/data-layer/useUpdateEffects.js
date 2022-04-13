import { DB } from './database';

export function useUpdateModEffects() {
  const updateModEffects = async (modId, effects) => {
    await DB.mods.update(modId, { effects });
  };

  return updateModEffects;
}
