import {getBatteflyTimeBuff, getBattleflyStats} from "../battlefly";
import { getBySign } from "../helpers";

import {ModSnapshot} from "./mod";

export class BattleflySnapshot {
  constructor(battlefly) {
    this.data = {
      id: battlefly.id,
      name: battlefly.name,
      level: battlefly.level,
      rarity: battlefly.rarity,
      traits: battlefly.traits,
    };

    const isConvertEffect = battlefly.mods.find((item) =>
      item.effects.find((item) => (item.type = 'NuclearDamage'))
    );

    if (isConvertEffect) {
      battlefly.mods = battlefly.mods.map((item) => {
        if (item.data && item.data.damageType === 'Missile') {
          item.data.damageType = 'Nuclear';

          item.data.damageTypes = ['Nuclear', 'Missile'];
        }

        return item;
      });
    }

    this.originalStats = getBattleflyStats(battlefly, battlefly.mods).stats;
    this.characteristics = getBattleflyStats(battlefly, battlefly.mods).characteristics;

    this.currentStats = { ...this.originalStats };
    this.mods = battlefly.mods.map((mod) => new ModSnapshot(mod, battlefly, this));

    this.state = {
      shieldBroken: false,
    };
    this.timeBuffs = getBatteflyTimeBuff(battlefly, battlefly.mods);
    this.debuffs = [];
  }

  getSensorsCharacteristics() {
    return this.characteristics.sensorsArray;
  }

  getRarity() {
    return this.data.rarity;
  }

  getLevel() {
    return this.data.level;
  }

  addDebuff(debuff) {
    const type = this.debuffs.find((item) => debuff instanceof item.constructor);
    if (!type) {
      this.debuffs.push(debuff);
      return debuff;
    }

    const result = type.cumulative(debuff);
    if (result && result !== type) {
      this.debuffs.push(result);

      return result;
    }

    return null;
  }

  getId() {
    return this.data.id;
  }

  getName() {
    return this.data.name;
  }

  getMaxHeatPoints() {
    return this.originalStats.hp;
  }

  getMaxShieldPoints() {
    return this.originalStats.shp;
  }

  getHeatPointsRegen() {
    return this.currentStats.hprg;
  }

  getShieldPointsRegen() {
    return this.currentStats.shrg;
  }

  getCritical() {
    return this.currentStats.crit;
  }

  getHeatPoints() {
    return this.currentStats.hp;
  }

  getArmor() {
    return this.currentStats.arm;
  }

  getEvasion() {
    return this.currentStats.eva;
  }

  getShieldPoints() {
    return this.currentStats.shp;
  }

  getCriticalResist() {
    return this.currentStats.rcrit;
  }

  getCriticalDamage() {
    return this.currentStats.dcrit;
  }

  getDebuffs(type) {
    return this.debuffs.filter((debuff) => debuff instanceof type);
  }

  getDebuff(type) {
    return this.debuffs.find((debuff) => debuff instanceof type);
  }

  getMods() {
    return this.mods;
  }

  getDamageTypeCalc(weapon) {
    const damageTypes = {
      Kinetic: 0,
      Energy: 0,
      Missile: 0,
      Nuclear: 0,
      Electric: 0,
    };

    const effects = this.getMods()
      .flatMap((mod) => mod.getDamageTypeEffects())
      .reduce(
        (a, { data }) => ({
          ...a,
          [data.attributeName]: a[data.attributeName] + data.attributeValue,
        }),
        damageTypes
      );
    const otherMods = weapon.getOtherModsEffects().reduce(
      (a, { data }) => ({
        ...a,
        [data.attributeName]: a[data.attributeName] + data.attributeValue,
      }),
      damageTypes
    );
    const otherModsPercentage = this.getMods()
      .filter((item) => item !== weapon)
      .flatMap((item) => item.getDamageTypes())
      .reduce((a, damageType) => a + (otherMods[damageType] || 0), 0);


    return (damage, types) => types.reduce((acc, type) => acc + getBySign(damage, true, effects[type]), getBySign(damage, true, otherModsPercentage));
  }

  setShieldPoints(change) {
    this.currentStats.shp = Math.max(this.currentStats.shp + change, 0);

    this.currentStats.shp = Math.min(this.currentStats.shp, this.originalStats.shp);
  }

  setArmor(change) {
    this.currentStats.arm = Math.max(this.currentStats.arm + change, 0);

    this.currentStats.arm = Math.min(this.currentStats.arm, this.originalStats.arm);
  }

  setHeatPoints(change) {
    this.currentStats.hp = Math.max(this.currentStats.hp + change, 0);

    this.currentStats.hp = Math.min(this.currentStats.hp, this.originalStats.hp);
  }
}
