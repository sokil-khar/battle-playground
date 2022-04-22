import { StatsData } from '../data/constants';
import battlefly from "../columns/battlefly";

function formatNumber(value) {
  if (value < 0) return 0;

  return value.toFixed(2);
}

function showShieldCalculation(stat, change, value, result = null) {
  const damage = Math.abs(change) - Math.max(value, 0);
  const showDamage = damage < 0 ? 0 : damage;

  return `${formatNumber(Math.abs(change))} ${StatsData[stat].sign} - ${formatNumber(value)} ${
    StatsData[stat].sign
  } = ^^${result ? formatNumber(result) : formatNumber(showDamage)} ${StatsData[stat].sign}]]`;
}

export const battleStarted = () => ({
  main: true,
  text: 'Battle started',
});

export const ignoreFirstAttack = (bfName) => ({
  text: `Wow! 🛡️ [[${bfName}]] tries to shoot but your opponent is nowhere to be seen!`,
});

export const ignoreFirstAttackUsed = (bfName) => ({
  text: `[[${bfName}]] is not invisible anymore!`,
});

export const frozenWeapon = (battleflyName) => ({
  text: `Wow! 🥶 [[${battleflyName}]] is frozen`,
});
export const ReloadWeaponEffect = (bflyName, weaponName, original, actual) => ({
  text: `✅ [[${bflyName}/${weaponName}]]'s reload time changed from ^^[[${original}]] to  ^^${actual}]] seconds`,
})
export const frozenStartWeapon = (battleflyName, duration) => ({
  text: `Wow! 🥶 [[${battleflyName}]] has used effect, so opponent's weapons was frozen for ^^${duration}]] seconds`,
});

export const destArm = (battleflyName, value) => ({
  text: `Wow! 💣 [[${battleflyName}]] has used effect and opponent's armor was destroyed ^^${value}]] points`,
});

export const crtDmg = (weapon, value, critChance, critResist) => ({
  text: `%%✅ ${weapon.getName()}]] [damage-type] come with critical damage ^^(${value} %)]] while critical chance is ^^(${critChance} %)]] and critical resist was ^^(${critResist} %)]]`,
  weapon,
});

export const crtDmgFailed = (weapon, critChance) => ({
  text: `%%❌ ${weapon.getName()}]] [damage-type] failed critical damage, critical chance is ^^(${critChance} %)]]`,
  weapon,
});
export const crtDmgFailed2 = (weapon, critChance, critResist) => ({
  text: `%%❌ ${weapon.getName()}]] [damage-type] failed critical damage, critical chance is ^^(${critChance} %)]] and critical resist was ^^(${critResist} %)]]`,
  weapon,
});

export const ev = (battleflyName, value) => ({
  text: `[[✅ ${battleflyName}]] evaded the attack with a ^^${value} %]] chance.`,
});

export const evFailed = (battleflyName, value) => ({
  text: `[[❌ ${battleflyName}]] failed to evade the attack with a ^^${value} %]] chance.`,
});

export const shAtt = (weapon, shieldPoints, damage, bonus) => ({
  text: `%%${weapon.getName()}]] [damage-type] hit the shield with (^^${formatNumber(
    shieldPoints
  )} SHP]]) ${bonus !== 0 ? `%%(with bonuses: [[${shieldPoints} ${bonus > 0 ? '-' : '+'} ${Math.abs(bonus)} = ${formatNumber( Math.max(shieldPoints - bonus, 0))} SHP)]]` : ''}. Remaining Damage = ^^${formatNumber(damage)}]]`,
  weapon,
});

export const shAttExp = (stat, change, value) => ({
  text: `Details ([damage-type]): ${showShieldCalculation(stat, change, value)}`,
});

export const shAbs = (weapon) => ({
  text: `Shield absorbs all damage 🛡️`,
  weapon,
});

export const nuclearIgnore = (weapon) => ({
  text: `☢️ Nuclear weapon ignores the shield`,
  weapon,
});

export const armAtt = (weapon, armor, damage) => ({
  text: `%%${weapon.getName()}]] [damage-type] hit the armor with (^^${formatNumber(
    armor
  )} ARM]]). Remaining Damage = ^^${formatNumber(damage)}]]`,
  weapon,
});

export const armAttExp = (stat, change, arm, isMinimum, result) => {
  return {
    text: `Details ([damage-type]): ${showShieldCalculation(stat, change, arm, result)} ${
      isMinimum ? `[[(25% damage saved)]]` : ''
    }`,
  };
};

export const armAbs = (weapon) => ({
  text: `Armor absorbs all damage 🛡️`,
  weapon,
});

export const hpAtt = (weapon, hp) => ({
  text: `%%${weapon.getName()}]] [damage-type] hit the hp with (^^${formatNumber(hp)} HP]]).`,
  weapon,
});

export const hpAttExp = (stat, change, value) => ({
  text: `Details ([damage-type]): ${showShieldCalculation(stat, change, value)}`,
});

export const voidStart = () => ({
  text: `🚨🚨🚨 [[The Hyperdome lose his shielding]] 🚨🚨🚨`,
});

export const voidAtt = (battleflyName, hp) => ({
  text: `🚨 [[${battleflyName} got hit by solar winds]] with (^^${formatNumber(hp)} damage]]).`,
});

export const voidAttExp = (stat, change, value) => ({
  text: `🚨 Details: ${showShieldCalculation(stat, change, value)} HP`,
});

export const hpRecover = (battleflyName, value, value2) => ({
  text: `❤️ [[${battleflyName}]] has recovered HP by ^^${formatNumber(
    value
  )} HP]] ^^(${formatNumber(value2)}%/s)]]`,
});

export const shpRecover = (battleflyName, value, value2) => ({
  text: `⚕️ [[${battleflyName}]] has recovered shield points by ^^${formatNumber(
    value
  )} SHP]] ^^(${formatNumber(value2)}%/s)]]`,
});

export const hpStatus = (battleflyName, hp) => ({
  text: `❤️❤️❤️ [[${battleflyName}]] HP is ^^${formatNumber(hp)} HP]] ❤️❤️❤️`,
});

export const shpStatus = (battleflyName, hp) => ({
  text: `🛡️🛡️🛡️ [[${battleflyName}]] SHP is ^^${formatNumber(hp)} SHP]] 🛡️🛡️🛡️`,
});

export const fullRecoverEffect = (battleflyName) => ({
  text: `Wow! 🗽 [[${battleflyName}]] has used the effect and fully recovered after the damage`,
});

export const damageTimeEffect = (battleflyName, value) => ({
  text: `Wow! 🗽 [[${battleflyName}]] has used the effect and opponent's next attack will be ^^${value}]]% :(`,
});

export const resurrectEffect = (battleflyName, value, percentage) => ({
  text: `Wow!🆒 [[${battleflyName}]] has used the effect and revived with ^^${percentage}%]] ^^(${value} HP)]] HP`,
});

export const revertAttackEffect = (battleflyName) => ({
  text: `Wow!🔃 [[${battleflyName}]] has used own effect and opponent's attack is inflicted to themselves.`,
});

export const revertAttackEffectFailed = () => ({
  text: `💻 You've hacked the Battlefly weapon system! "Oh no, told you ^^"qwerty"]] was a bad password`,
});

export const damageTypeAttackCanceled = (battleflyName) => ({
  text: `❌ [[${battleflyName}]] attack was cancelled because its mode has ^^Kinetic]] damage type`,
});

export const convertToNuclear = (weapon) => ({
  text: `☢️ [[${weapon.getName()}]] damage type was converted to ^^Nuclear]]`,
});

export const updateModStatEffect = (battleflyName, effect) => ({
  text: `Wow! [[${battleflyName}]] has ^^${
    effect.healthPercentage
  }%]] health or below, own ^^${effect.getStat()}]] are changed by ^^${effect.getValue()}%]]`,
});

export const sufferAttackEffect = (battleflyName, value) => ({
  text: `Wow!🔃 [[${battleflyName}]] has used own effect and opponent also suffer ^^${value} HP]].`,
});

export const burnStartEffect = (battleflyName) => ({
  text: `Wow! 🔥 [[${battleflyName}]] has used own effect and opponent was burned.`,
});

export const burnEffect = (battleflyName, value) => ({
  text: `🔥 [[${battleflyName}]] has taken ^^${value}]] damage`,
});

export const electricStartEffect = (battleflyName) => ({
  text: `Wow! ⚡ [[${battleflyName}]] has used own effect and opponent was electrified.`,
});

export const electricEffect = (battleflyName, value) => ({
  text: `⚡ [[${battleflyName}]] has taken ^^${value}]] damage`,
});

export const winnerReport = (battleflyName) => ({
  text: `⚔️ [[${battleflyName}]] is winner`,
});

export const dealtDamage = (battleflyName, damage, weapon, shieldBlocked, armorBlocked) => ({
  text: `🗯️ Battlefly [[${battleflyName}]] has dealt ^^${formatNumber(
    damage
  )}]] damage with "%%${weapon.getName()}]]". Shield has blocked ^^"${formatNumber(
    shieldBlocked
  )}"]] damage. Armor has blocked ^^"${formatNumber(armorBlocked)}"]] damage`,
  weapon,
});

export const bonusesDamage = (v0, v2, v3, v4, v5, v6, v7) => ({
  text: `❓❓❓ [[Original Damage]]=^^${formatNumber(v0)}]]; [[Weapon Bonus]]=^^${formatNumber(
    v7
  )}]]  [[Critical damage Bonus]]=^^${formatNumber(v6)}]]; [[Armor Damage Effect]]=^^${formatNumber(
    v2
  )}]]; [[Max Health Effect]]=^^${formatNumber(v3)}]]; [[Damage Type Effect]]=^^${formatNumber(
    v4
  )}]]. [[All Damage]]=🎯^^${formatNumber(v5)}]]🎯`,
});

export const shieldDamageRep = (originalDamage, maxHealthDamage, criticalBonus, realDamage) => ({
  text: `❓❓❓ [[Original Damage]]=^^${formatNumber(originalDamage)}]]; [[Max Health Damage]]=^^${formatNumber(
    maxHealthDamage
  )}]]  [[Critical Damage Coefficient]]=^^${formatNumber(criticalBonus)}]]; [[Real Damage]]=^^${formatNumber(
    realDamage
  )}]];🎯`,
});

export const armDamageRep = (leftDamage, weaponBonus, criticalBonus, armorDamage, damageTypeBonus, allDamage) => ({
  text: `❓❓❓ [[Left Damage]]=^^${formatNumber(leftDamage)}]]; [[Weapon Bonus]]=^^${formatNumber(
    weaponBonus
  )}]]; [[Armor Damage Bonus]]=^^${formatNumber(
    armorDamage
  )}]]; [[Damage Type Bonus]]=^^${formatNumber(
    damageTypeBonus
  )}]]. [[Critical Damage Coefficient]]=^^${formatNumber(criticalBonus)}]]; [[All Damage]]=🎯^^${formatNumber(allDamage)}]]🎯`,
});

export const shieldDamageBonus = (weapon, value) => ({
  text: `Wow! 🛡️ %%${weapon.getName()}]] has used own effect, so the ^^shield points]] decreased by ^^${value}]] points`,
  weapon,
});

export const hpDamageBonus = (weapon, value) => ({
  text: `Wow! 💔 %%${weapon.getName()}]] has used own effect, so the ^^HP points]] decreased by ^^${value}]] points`,
  weapon,
});

export const virusDesc = (stat, value) => ({
  text: `🦠 Virus decreased opponents' [[${stat}]]: ^^${value}%]]`,
});

export const linkedAttackDesc = () => ({
  text: `⚡⚡ Linked Combat Systems was activated. Weapons are attacking together.`,
});

export const brokenShield = (battleflyName) => ({
  text: `Oooops!!! 🛡🛡🛡 [[${battleflyName}'s]] shield was destroyed.`,
});
