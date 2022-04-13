const { createStatEffect, EffectType, ModTraitsHandlers } = require('./constants');
const { getBySign } = require('./helpers');

export function getModStats(mod, battlefly) {
  if(!mod.data.damageTypes) {
    mod.data.damageTypes = [mod.data.damageType];
  }

  const effects = getModStatsEffects(mod, battlefly);
  const stats = { ...mod.data };

  for (const effect of effects) {
    switch (effect.type) {
      case EffectType.Stat:
        {
          const { stat, change } = effect.data;
          if (!(stat in stats)) continue;

          stats[stat] += change;
        }
        break;

      default:
        break;
    }
  }

  return { stats };
}

export function getModStatsEffects(mod, battlefly) {
  const steps = [withTraits, withEffects];
  const updates = steps.map((step) => step(mod, battlefly)).flat();

  const { characteristics } = battlefly;

  const secondarySteps = [withCharacteristics];
  const secondaryUpdates = secondarySteps.map((step) => step(mod, characteristics)).flat();

  return updates.concat(secondaryUpdates);
}

function withTraits(mod, battlefly) {
  const { traits } = battlefly;
  const updates = [];

  for (const trait of traits) {
    const handler = ModTraitsHandlers[trait.action];
    if (!handler) continue;

    const effect = handler(mod, trait);
    if (!effect) continue;

    updates.push(effect);
  }

  return updates;
}

function withEffects(mod) {
  const items = mod.effects || [];
  const updates = [];

  for (const effect of items) {
    if (effect.type !== 'ModStat') continue;

    const { attributeValue, attributeName, attributeSign, percentage } = effect.data;
    const value = getBySign(mod.data[attributeName], percentage || attributeSign, attributeValue);

    updates.push(createStatEffect(attributeName, value));
  }

  return updates;
}

function withCharacteristics(mod, characteristics) {
  const updates = [];

  function updateModDamageByType(type, value) {
    if (!mod.data.damageTypes.includes(type)) return null;

    const change = mod.data.damagePerFire * (value / 100);
    return createStatEffect('damagePerFire', change);
  }

  for (const characteristic in characteristics) {
    const points = characteristics[characteristic];

    switch (characteristic) {
      case 'fusionBattery':
        updates.push(updateModDamageByType('Energy', points * 1));

        break;

      case 'nanoFrames':
        updates.push(updateModDamageByType('Electric', points * 1));

        break;

      case 'engines':
        updates.push(updateModDamageByType('Kinetic', points * 1));

        break;

      case 'cpu':
        const reloadPoints = -points * 0.5;

        updates.push(createStatEffect('reload', getBySign(mod.data.reload, '%', reloadPoints)));
        updates.push(updateModDamageByType('Missile', points * 1));

        break;

      default:
        break;
    }
  }

  return updates.filter(Boolean);
}
