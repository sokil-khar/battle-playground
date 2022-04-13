import { getBySign } from "./helpers";

export const EffectType = {
  Stat: 'STAT',
  Characteristic: 'CHARACTERISTIC',
};

export const UpdateReason = {
  MagicValue: 'MagicValue',
  Trait: 'Trait',
  Mod: 'Mod',
  ModEffect: 'ModEffect',
  Characteristic: 'Characteristic',
};

export function createStatEffect(stat, change, reason) {
  return {
    type: EffectType.Stat,
    data: {
      stat,
      change,
      reason,
    },
  };
}

export function createCharacteristicEffect(characteristic, change, reason) {
  return {
    type: EffectType.Characteristic,
    data: {
      characteristic,
      change,
      reason,
    },
  };
}

export const StatUpdateReason = {
  MagicValue() {
    return {
      reason: UpdateReason.MagicValue,
    };
  },
  Trait(trait) {
    return {
      reason: UpdateReason.Trait,
      data: {
        trait,
      },
    };
  },
  Mod(mod) {
    return {
      reason: UpdateReason.Mod,
      data: {
        mod,
      },
    };
  },
  ModEffect(effect) {
    return {
      reason: UpdateReason.ModEffect,
      data: {
        effect,
      },
    };
  },
  Characteristic(characteristic) {
    return {
      reason: UpdateReason.Characteristic,
      data: {
        characteristic,
      },
    };
  },
};

export const TraitHandlers = {
  addValue(_, trait) {
    const { attributeName, attributeValue } = trait.data;

    return createStatEffect(attributeName, attributeValue, StatUpdateReason.Trait(trait));
  },
  addPercentage(battlefly, trait) {
    const { attributeName, attributeValue } = trait.data;
    const { stats } = battlefly;

    const change = getBySign(stats[attributeName], '%', attributeValue);
    return createStatEffect(attributeName, change, StatUpdateReason.Trait(trait));
  },
};

export const ModTraitsHandlers = {
  addWeaponPercentage(mod, trait) {
    const { attributeName, attributeValue } = trait.data;
    const { data } = mod;

    if (!(attributeName in data)) return null;

    const change = getBySign(data[attributeName], '%', attributeValue);
    return createStatEffect(attributeName, change, StatUpdateReason.Trait(trait));
  },
  addWeaponDamageByType(mod, trait) {
    const { attributeName, attributeValue } = trait.data;
    const { data } = mod;

    if (data.damageType !== attributeName) return null;

    const change = getBySign(data.damagePerFire, '%', attributeValue);
    return createStatEffect('damagePerFire', change, StatUpdateReason.Trait(trait));
  },
};
