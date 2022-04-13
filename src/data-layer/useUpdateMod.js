import { DB } from './database';
import { ModType } from '../data/constants';

function toWeapon(item) {
  return {
    damageType: item.damageType,
    reload: item.reload,
    fireRate: item.fireRate,
    damagePerFire: item.damagePerFire,
  };
}

function toSystem(item) {
  return {
    shp: item.shp,
    arm: item.arm,
  };
}

export function useUpdateMod() {
  const updateMod = async (modId, mod) => {
    const item = {
      id: mod.id,
      name: mod.name,
      rarity: mod.rarity,
      type: mod.type,
      data: mod.type === ModType.Weapon ? toWeapon(mod.data) : toSystem(mod.data),
    };

    await DB.mods.update(modId, item);
  };

  return updateMod;
}
