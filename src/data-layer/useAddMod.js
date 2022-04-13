import { DB } from './database';
import { v4 as uuidv4 } from 'uuid';
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

export function useAddMod() {
  const addMod = async (mod) => {
    const item = {
      id: uuidv4(),
      name: mod.name,
      rarity: mod.rarity,
      type: mod.type,
      data: mod.type === ModType.Weapon ? toWeapon(mod.data) : toSystem(mod.data),
      effects: [],
    };
    const itemId = await DB.mods.add(item);

    return DB.mods.get(itemId);
  };

  return addMod;
}
