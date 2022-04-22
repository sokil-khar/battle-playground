import { getBySign, getUpdateStatValues } from "../helpers";
import { getModStats } from "../mod";
import { DebuffMap, Effect, ElectricUpdateModStatDebuff, UpdateModStatDebuff } from "./debuff";
import { Time } from "./time";

export class ModSnapshot {
  constructor(mod, battlefly, owner) {
    this.original = {
      id: mod.id,
      name: mod.name,
      rarity: mod.rarity,
      type: mod.type,
      effects: mod.effects || [],
    };

    this.used = 0;
    this.effects = (mod.effects || []).map((item) => new Effect(item, this));

    this.debuffs = (mod.effects || [])
      .filter((item) => DebuffMap[item.type])
      .map((item) => new DebuffMap[item.type](item.data));

    this.owner = owner;

    this.originalStats = getModStats(mod, battlefly).stats;
    if (this.originalStats.reload) {
      this.originalStats.reload = parseFloat(Number(this.originalStats.reload).toFixed(2));
    }

    this.currentStats = { ...this.originalStats };
  }

  hasDamageType(type) {
    return this.currentStats.damageTypes.includes(type)
  }

  getRarity() {
    return this.original.rarity;
  }

  getAttackCount() {
    return this.currentStats.fireRate;
  }

  getReload() {
    const debuffs = this.owner
      .getDebuffs(UpdateModStatDebuff)
      .filter((debuff) => debuff.getStat() === 'reload' && debuff.isUsed(this.owner));
    const additionalReload = debuffs.reduce((a, c) => a + c.value, 0);
    let reloadTime = this.currentStats.reload + this.currentStats.reload * (additionalReload / 100);
    for (const buff of this.owner.timeBuffs)
    {
      if (buff.percentage)
      {
        reloadTime  = reloadTime + reloadTime * buff.value/100;
      }
      else {
        reloadTime = reloadTime + buff.value;
      }
    }
    return reloadTime;
  }

  needActivate(time) {
    const maxUsage = this.getMaxUsages();
    const speed = parseFloat((this.getReload() * Time.SCALE).toFixed(2));

    if (maxUsage <= this.used) return false;
    return !!time.get() && time.get() % speed === 0;
  }
  getReloadEffect()
  {
    const actualReload = this.getReload();
    return {actualReload, originalReload: this.originalStats.reload}
  }
  getMaxUsages() {
    const effect = this.getEffect('MaxUsage');
    if (!effect) return Infinity;

    return effect.data.value || Infinity;
  }

  getDamageTypeEffects() {
    const effects = this.getEffects('DamageType');

    return effects;
  }

  getOtherModsEffects() {
    const effects = this.getEffects('OtherDamageType');

    return effects;
  }

  getEvasionCalc(target) {
    const effects = target
      .getMods()
      .flatMap((mod) => (!mod.isWeapon() ? mod.getAttributeEffects('eva') : []));
    const myEffects = !this.isWeapon() ? [] : this.getAttributeEffects('eva');

    return (evasion, damageTypes) => {
      const finalEffects = effects.filter(
        (effect) => !effect.data.damageTypes || effect.data.damageTypes.some(type => damageTypes.includes(type))
      );

      const myFinalEffects = myEffects.filter(
        (effect) => !effect.data.damageTypes || effect.data.damageTypes.some(type => damageTypes.includes(type))
      );
      finalEffects.forEach((effect) => {
        delete effect.data.percentage;
      });

      return (
        evasion +
        getUpdateStatValues(finalEffects)(evasion) +
        getUpdateStatValues(myFinalEffects)(evasion)
      );
    };
  }

  getCriticalCalc() {
    const effects = this.getAttributeEffects('crit');

    return (critical) => getUpdateStatValues(effects)(critical) + critical;
  }

  getArmorCalc() {
    const effects = this.getAttributeEffects('arm');

    return (armor) => getUpdateStatValues(effects)(armor) + armor;
  }

  getMaxHealthDamageCalc() {
    const effects = this.getEffects('MaxHealthDamage');
    const percentage = effects.reduce((a, c) => a + c.data.value, 0);

    return (maxHealth) => getBySign(maxHealth, true, percentage);
  }

  getCriticalResistCalc() {
    const effects = this.getAttributeEffects('rcrit');

    return (value) => getUpdateStatValues(effects)(value) + value;
  }

  getCriticalDamageCalc() {
    const effects = this.getAttributeEffects('dcrit');

    return (value) => getUpdateStatValues(effects)(value) + value;
  }

  getEffect(type) {
    return this.effects.find((effect) => effect.getType() === type);
  }

  getEffects(type) {
    return this.effects.filter((effect) => effect.getType() === type);
  }

  getDebuff(type) {
    return this.debuffs.find((debuff) => debuff instanceof type);
  }

  getShieldDamageCalc() {
    const effects = this.getAttributeEffects('damagePerFire')
      .filter((effect) => effect.data.attributeTarget === 'Shield')
      .map((effect) => {
        return effect;
      });

    return getUpdateStatValues(effects);
  }

  getHPDamageCalc() {
    const effects = this.getAttributeEffects('damagePerFire')
      .filter((effect) => effect.data.attributeTarget === 'HP')
      .map((effect) => {
        return effect;
      });

    return getUpdateStatValues(effects);
  }

  getArmorDamageCalc(armor) {
    const effects = this.getEffects('ArmorDamage');
    return (damage) =>
      effects.reduce(
        (a, { data }) => a + getBySign(damage, data.percentage, (armor * data.dmg) / data.arm),
        0
      );
  }

  getDamage(time) {
    const debuffs = this.owner
      .getDebuffs(UpdateModStatDebuff)
      .filter((debuff) => debuff.getStat() === 'damagePerFire' && debuff.isUsed(this.owner));
    const additionalDebuffs = this.owner
      .getDebuffs(ElectricUpdateModStatDebuff)
      .filter((debuff) => debuff.getStat() === 'damagePerFire' && !debuff.isUsed(time));
    const additionalDamage = debuffs.concat(additionalDebuffs).reduce((a, c) => a + c.value, 0);
    const effects = this.getAttributeEffects('damagePerFire').filter(
      (effect) => !effect.data.attributeTarget
    );

    return (damage) => getUpdateStatValues(effects)(damage) + damage * (additionalDamage / 100);
  }

  getAttributeEffects(attribute) {
    return this.effects.filter(
      (effect) => effect.getType() === 'UpdateStat' && effect.getAttributeName() === attribute
    );
  }

  getName() {
    return this.original.name;
  }

  getDamageTypes() {
    return this.currentStats.damageTypes;
  }

  isWeapon() {
    return this.original.type === 'Weapon';
  }

  isSystem() {
    return this.original.type === 'System';
  }
}
