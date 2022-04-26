import {
  EffectType,
  TraitHandlers,
  createStatEffect,
  createCharacteristicEffect,
  StatUpdateReason, createDamageBonus, DamageUpdateReason,
} from './constants';
import { getBySign } from './helpers';
import {DamageType, StatsData} from "../data/constants";
import {getDefaultStats} from "../data-layer/useInitializeData";

export function getBattleflyStats(battlefly, mods = []) {
  const effects = getBattleflyStatsEffects(battlefly, mods);
  const stats = { ...battlefly.stats };
  const characteristics = { ...battlefly.characteristics };
  for (const effect of effects) {
    switch (effect.type) {
      case EffectType.Stat: {
        const { stat, change } = effect.data;
        if (!(stat in stats)) throw new Error(`Invalid stat name ${stat}`);

        stats[stat] += change;
        break;
      }

      case EffectType.Characteristic: {
        const { characteristic, change } = effect.data;

        characteristics[characteristic] += change;
        break;
      }

      default:
        break;
    }
  }
  return { stats, characteristics };
}

export function getBatteflyTimeBuff(battlefly, mods = []) {
  const reloads = [];
  const items = mods.flatMap((mod) => (mod.effects?.length ? mod.effects : []));
  for (const mod of items)
  {
    if (mod.type !== 'ModStat') continue;
    const { attributeValue, attributeName, attributeSign, percentage } = mod.data;
    if (attributeName === 'reload')
    {
      reloads.push({type: attributeName, percentage: percentage, value: attributeValue});
    }
  }
  return reloads;
}
export function getActualDamageBonus(battlefly, mods = []) {
  const effects = getBattleflyDamageBonus(battlefly, mods);
  const weaponbonus = { ...battlefly.weaponbonus };
  for (const effect of effects) {
    if (effect.type in DamageType)
    {
      const { type, change } = effect.data;
      weaponbonus[type] += change;
    }
  }
  return { weaponbonus };
}
export function getBattleflyStatsEffects(battlefly, mods) {
  // 1. Get original stats
  const { characteristics } = battlefly;

  // 2. Check for BattleflyStat, UpdateCharacteristic, Traits
  const steps = [withTraits, withMods];
  const updates = steps.map((step) => step(battlefly, mods)).flat();
  // 3. Apply characteristics updates
  const newCharacteristics = { ...characteristics };
  for (const update of updates) {
    if (update.type !== EffectType.Characteristic) continue;

    const { characteristic, change } = update.data;
    newCharacteristics[characteristic] += change;
  }
  // 4. Check for Characteristics
  // const secondarySteps = [withCharacteristics];
  // const secondaryUpdates = secondarySteps.map((step) => step(battlefly, newCharacteristics)).flat();
  return updates;
}

function withMods(battlefly, mods) {
  const updates = [];
  const items = mods.flatMap((mod) => {
     if (mod.effects?.length)
     {
       return mod.effects.map((effect) => ({...effect, name: mod.name}))
     }
     else {
       return []
     }
  });
  for (const mod of mods) {
    const items = mod.effects || [];
    if (mod.type === 'Weapon') continue;

    updates.push(
      createStatEffect('shp', mod.data.shp, StatUpdateReason.Mod(mod)),
      createStatEffect('arm', mod.data.arm, StatUpdateReason.Mod(mod))
    );
  }
  const bflyStat = {...getDefaultStats()};
  const effectedStat = updates.map((stat) => {
    bflyStat[stat.data.stat] = stat.data.change
    return bflyStat
  }).pop();
  for (const effect of items) {
    switch (effect.type) {
      case 'BattleflyStat': {
        const { attributeValue, attributeName, attributeSign, percentage } = effect.data;
        let value = attributeValue;
        if (!StatsData[attributeName].sign.includes('%')){
           value = getBySign(
              battlefly.stats[attributeName] + effectedStat[attributeName]?effectedStat[attributeName]: 0 ,
              percentage || attributeSign,
              attributeValue
          );
        }
        updates.push(createStatEffect(attributeName, value, StatUpdateReason.ModEffect(effect)));
        break;
      }

      case 'UpdateCharacteristic': {
        const { attributeValue, attributeName } = effect.data;

        updates.push(createCharacteristicEffect(attributeName, attributeValue));

        break;
      }

      default:
        break;
    }
  }
  return updates;
}

function withTraits(battlefly) {
  const { traits } = battlefly;
  const updates = [];
  for (const trait of traits) {
    const handler = TraitHandlers[trait.action];
    if (!handler) continue;

    const effect = handler(battlefly, trait);
    if (!effect) continue;

    updates.push(effect);
  }

  return updates;
}

export function getBattleflyDamageBonus(battlefly, mods)
{
   const effects = mods.flatMap((mod) => (mod.effects?.length? mod.effects: []));
   const updates = [];
    for (const effect of effects) {

      switch (effect.type) {
        case "DamageType": {
          const { attributeValue, attributeName, attributeSign, percentage } = effect.data;
          updates.push(createDamageBonus(attributeName, attributeValue, DamageUpdateReason.ModEffect(effect)));
          break;
        }
        default:
          break;
      }
    }
    return updates;
}


function withCharacteristics(battlefly, characteristics) {
  const updates = [];

  for (const characteristic in characteristics) {
    const points = characteristics[characteristic];

    switch (characteristic) {
      case 'sensorArray':
        updates.push(
          createStatEffect('crit', points * 0.5, StatUpdateReason.Characteristic(characteristic))
        );
        updates.push(
          createStatEffect('scv', points * 1, StatUpdateReason.Characteristic(characteristic))
        );
        updates.push(
          createStatEffect('dcrit', points * 1, StatUpdateReason.Characteristic(characteristic))
        );
        break;

      case 'fusionBattery':
        updates.push(
          createStatEffect('shp', points * 10, StatUpdateReason.Characteristic(characteristic))
        );
        updates.push(
          createStatEffect('shrg', points * 0.5, StatUpdateReason.Characteristic(characteristic))
        );
        break;

      case 'nanoFrames':

        updates.push(
          createStatEffect(
            'hp',
            battlefly.stats.hp * (points / 100),
            StatUpdateReason.Characteristic(characteristic)
          )
        );
        updates.push(
          createStatEffect('arm', points * 0.25, StatUpdateReason.Characteristic(characteristic))
        );
        updates.push(
            createStatEffect('rcrit', points * 1, StatUpdateReason.Characteristic(characteristic))
        );
        break;

      case 'engines':
        updates.push(
          createStatEffect('eva', points * 1, StatUpdateReason.Characteristic(characteristic))
        );

        break;

      case 'cpu':
        updates.push(
          createStatEffect('xpr', points * 2, StatUpdateReason.Characteristic(characteristic))
        );

        break;

      default:
        break;
    }
  }

  return updates;
}
