import { chain } from 'lodash';
import { getBattleflyPowerRating, } from '../data/constants';
import { checkPercentage } from '../random';

import { BattleflySnapshot } from './core/battlefly';
import { BurnDebuff, CancelAttackDebuff, DamageTimeDebuff, ElectricUpdateModStatDebuff, FrizeDebuff, RevertAttackDebuff, UpdateModStatDebuff, VirusDebuff } from './core/debuff';
import { Time } from './core/time';
import {
  shAtt,
  battleStarted,
  crtDmg,
  ev,
  frozenWeapon,
  ReloadWeaponEffect,
  ignoreFirstAttack,
  shAttExp,
  shAbs,
  armAtt,
  armAttExp,
  armAbs,
  hpAtt,
  hpAttExp,
  hpRecover,
  shpRecover,
  hpStatus,
  fullRecoverEffect,
  damageTimeEffect,
  resurrectEffect,
  revertAttackEffect,
  updateModStatEffect,
  sufferAttackEffect,
  burnEffect,
  burnStartEffect,
  winnerReport,
  dealtDamage,
  frozenStartWeapon,
  evFailed,
  crtDmgFailed,
  crtDmgFailed2,
  shieldDamageBonus,
  ignoreFirstAttackUsed,
  revertAttackEffectFailed,
  voidAtt,
  voidAttExp,
  shpStatus,
  voidStart,
  damageTypeAttackCanceled,
  destArm,
  hpDamageBonus,
  virusDesc,
  linkedAttackDesc,
  brokenShield,
  electricStartEffect,
  shieldDamageRep,
  armDamageRep,
} from './reports';


// TODO: refactor battle code for step and mods effects, now it's not scalable, it's fast prototype with very complex battle logic

// TODO: check mods effects


// TODO: remove some magic numbers

class Battle {
  constructor(battleflies) {
    this.battleflies = battleflies;
    this.mods = battleflies.flatMap((battlefly) => battlefly.getMods());

    this.report = [];
    this.winner = null;

    this.state = {
      time: null,
      turn: null,
      leftDamage: 0,
      criticalDamage: 100,
      isEvasion: false,
      evasionChance: 0,
      shieldBlocked: 0,
      armorBlocked: 0,
      voidDamage: 1,
      attack: null,
    };
  }

  getAttacksForThisStep() {
    const frozenBattleflies = this.battleflies.filter(
      (bf) =>
        bf.getDebuffs(FrizeDebuff).filter((db) => db && !db.isUsed(this.state.time)).length > 0
    );

    const FirstAttackShieldEffects = chain(this.mods)
      .map((mod) => mod.getEffect('FirstAttackShield'))
      .filter((effect) => effect && !effect.isUsed())
      .uniqBy('owner.owner.id')
      .value();
    let ignoreAttackOn =
      FirstAttackShieldEffects.length > 1 ? null : FirstAttackShieldEffects[0] || null;

    // TODO: remove magic number
    if (ignoreAttackOn && this.state.time.getValue() >= 8) {
      ignoreAttackOn.use();
      this.addReportEvent(ignoreFirstAttackUsed, ignoreAttackOn.owner.owner.getName());
      ignoreAttackOn = null;
    }
    const weapons = this.mods.filter((mod) => mod.isWeapon());

    const attacks = [];
    for (const weapon of weapons) {
      if(this.state.time.getValue() === 0.01 && weapon.getEffect('FreeAttack')) {
        attacks.push({
          weapon,
          target: weapon.owner === this.battleflies[0] ? this.battleflies[1] : this.battleflies[0],
          source: weapon.owner,
        });

        continue;
      }

      if (weapon.needActivate(this.state.time)) {
        if (frozenBattleflies.includes(weapon.owner)) {
          this.addReportEvent(frozenWeapon, weapon.owner.getName());

          continue;
        }
        const {actualReload, originalReload} = weapon.getReloadEffect();
        if (actualReload !== originalReload)
        {
          this.addReportEvent(ReloadWeaponEffect, weapon.owner.getName(),weapon.getName(), originalReload, actualReload);
        }
        attacks.push({
          weapon,
          target: weapon.owner === this.battleflies[0] ? this.battleflies[1] : this.battleflies[0],
          source: weapon.owner,
        });
      }
    }

    return this.sortAttacks(attacks);
  }

  getWinner() {
    if (this.battleflies[0].getHeatPoints() <= 0) return this.battleflies[1];
    if (this.battleflies[1].getHeatPoints() <= 0) return this.battleflies[0];

    return null;
  }

  getLoser() {
    if (this.battleflies[0].getHeatPoints() <= 0) return this.battleflies[0];
    if (this.battleflies[1].getHeatPoints() <= 0) return this.battleflies[1];

    return null;
  }

  get ended() {
    return this.getWinner() !== null;
  }

  end() {
    const winner = this.getWinner();
    if (!winner) return;

    const loser = this.getLoser();
    if (!loser) return;

    const ResurrectEffect = chain(loser.getMods())
      .map((mod) => mod.getEffect('Resurrect'))
      .filter((effect) => effect && !effect.isUsed())
      .first()
      .value();
    if (ResurrectEffect) {
      const healthPercentage = ResurrectEffect.data.healthPercentage;

      ResurrectEffect.use();

      const maxHP = loser.getMaxHeatPoints();
      loser.setHeatPoints(maxHP * (healthPercentage / 100));

      this.addReportEvent(
        resurrectEffect,
        loser.getName(),
        maxHP * (healthPercentage / 100),
        healthPercentage
      );
    }
  }

  attack(attack) {
    if (this.getWinner()) return;
    if (this.ended) return;

    if(attack.source.getDebuffs(FrizeDebuff).filter((db) => db && !db.isUsed(this.state.time)).length > 0) {
      this.addReportEvent(frozenWeapon, attack.weapon.owner.getName());

      return;
    }

    const FirstAttackShieldEffects = chain(this.mods)
      .map((mod) => mod.getEffect('FirstAttackShield'))
      .filter((effect) => effect && !effect.isUsed())
      .uniqBy('owner.owner.id')
      .value();
    let ignoreAttackOn =
      FirstAttackShieldEffects.length > 1 ? null : FirstAttackShieldEffects[0] || null;

    if (ignoreAttackOn && attack.weapon.owner !== ignoreAttackOn.getBattlefly()) {
      this.addReportEvent(ignoreFirstAttack, attack.source.getName());

      return;
    }
    if (ignoreAttackOn && attack.weapon.owner === ignoreAttackOn.getBattlefly()) {
      ignoreAttackOn.use();

      this.addReportEvent(ignoreFirstAttackUsed, ignoreAttackOn.owner.owner.getName());
    }

    const DamageBothEffect = attack.weapon.getEffect('DamageBoth');
    if (DamageBothEffect && !attack.isDamageBoth) {
      const attacks = [
        {
          ...attack,
          isDamageBoth: true,
        },
        {
          weapon: attack.weapon,
          target: attack.source,
          source: attack.target,
          isDamageBoth: true,
        },
      ];

      for (const attack of this.sortAttacks(attacks)) {
        this.attack(attack);
      }

      return;
    }

    const revertDebuffs = attack.source
      .getDebuffs(RevertAttackDebuff)
      .filter((debuff) => !debuff.isUsed());
    if (revertDebuffs.length) {
      const isSuccess = checkPercentage(revertDebuffs[0].getChance());
      if (isSuccess) {
        [attack.target, attack.source] = [attack.source, attack.target];

        revertDebuffs[0].use();

        this.addReportEvent(revertAttackEffect, attack.source.getName());
      } else {
        this.addReportEvent(revertAttackEffectFailed, attack.source.getName());
      }
    }

    const [CancelAttack] = chain(attack.target.getMods())
      .map((mod) => mod.getDebuff(CancelAttackDebuff))
      .filter((debuff) => debuff && !debuff.isUsed())
      .value();
    if (CancelAttack && attack.weapon.hasDamageType(CancelAttack.getDamageType())) {
      CancelAttack.use();

      this.addReportEvent(damageTypeAttackCanceled, attack.source.getName());

      return;
    }

    const { weapon, target, source } = attack;

    this.state.turn = 0;
    this.state.attack = attack;

    const targetOldHp = target.getHeatPoints();
    for (let i = 0; i < weapon.getAttackCount(); i += 1) {
      this.criticalDamageStep(attack);
      this.evasionStep(attack);

      if (this.state.isEvasion) {
        this.addReportEvent(ev, target.getName(), this.state.evasionChance);
        this.afterTurn();

        continue;
      } else {
        this.addReportEvent(evFailed, target.getName(), this.state.evasionChance);
      }

      this.attackShieldStep(attack);

      if (this.getLeftDamage() === 0) {
        this.addReportEvent(shAbs, weapon);
        this.afterTurn(attack);

        continue;
      }

      this.attackArmorStep(attack);

      if (this.getLeftDamage() === 0) {
        this.addReportEvent(armAbs, weapon);
        this.afterTurn(attack);

        continue;
      }

      this.attackHPStep(attack);

      if (this.getWinner()) this.end();

      if (!this.ended) {
        this.afterTurn(attack);
      } else {
        break;
      }
    }

    this.addReportEvent(
      dealtDamage,
      source.getName(),
      targetOldHp - target.getHeatPoints(),
      weapon,
      this.state.shieldBlocked,
      this.state.armorBlocked
    );

    if (!this.ended) {
      this.afterAttack(attack);
    }
  }

  afterTurn(attack) {
    this.state.leftDamage = 0;
    this.state.criticalDamage = 100;
    this.state.isEvasion = false;
    this.state.evasionChance = 0;
    this.state.turn++;

    if (attack) {
      const { weapon, target } = attack;

      const virus = weapon.getDebuff(VirusDebuff);
      if (virus) {
        const updates = virus.use(target);
        updates.forEach((update) => this.addReportEvent(virusDesc, ...update));
      }
    }

    if (this.getWinner()) {
      this.end();
    }
  }

  afterAttack(attack) {
    this.state.attack = null;
    this.state.turn = null;
    this.state.shieldBlocked = 0;
    this.state.armorBlocked = 0;

    const { weapon, source, target } = attack;

    weapon.used++;

    // Check effects
    const critEf = source
      .getMods()
      .flatMap((item) => item.getEffect('CritUpdate') || []);

      critEf.forEach((effect) => {
        if(effect.current >= 20) return;
        effect.current = effect.current + 1 || 0;

        source.currentStats.crit += effect.data.value;
        source.currentStats.dcrit += effect.data.value;
      });

    const evaEf = source
      .getMods()
      .flatMap((item) => item.getEffect('EvaUpdate') || []);

    evaEf.forEach((effect) => {
      if(effect.current > 5) return;
      effect.current = effect.current + 1 || 0;

      source.currentStats.eva += effect.data.value;
    });

    const UpdateModStatDebuffEffects = target
      .getMods()
      .flatMap((item) => item.getEffects('UpdateModStatDebuff') || []);

    UpdateModStatDebuffEffects.forEach((effect) => {
      const debuff = new UpdateModStatDebuff(effect.data);
      target.addDebuff(debuff);

      if (!debuff.isUsed(target)) return;

      this.addReportEvent(updateModStatEffect, target.getName(), debuff);
    });

    const UpdateModStatDebuffEffects2 = source
      .getMods()
      .flatMap((item) => item.getEffects('UpdateModStatDebuff') || []);

    UpdateModStatDebuffEffects2.forEach((effect) => {
      const debuff = new UpdateModStatDebuff(effect.data);
      source.addDebuff(debuff);

      if (!debuff.isUsed(source)) return;

      this.addReportEvent(updateModStatEffect, source.getName(), debuff);
    });

    const FreezeDebuff = weapon.getEffect('FreezeDebuff');
    if (FreezeDebuff) {
      target.addDebuff(new FrizeDebuff(FreezeDebuff.data, this.state.time));

      this.addReportEvent(frozenStartWeapon, source.getName(), FreezeDebuff.data.duration);
    }

    const BurnDebuffEffects = source.getMods().flatMap((mod) => mod.getEffect('BurnDebuff') || []);
    for (const effect of BurnDebuffEffects) {
      if (target.addDebuff(new BurnDebuff(effect.data, this.state.time))) {
        this.addReportEvent(burnStartEffect, source.getName());
      }
    }

    const RevertAttack = weapon.getEffect('RevertAttack');
    if (RevertAttack) {
      target.addDebuff(new RevertAttackDebuff(RevertAttack.data));
    }

    const DestroyArmor = weapon.getEffect('DestroyArmor');
    if (DestroyArmor && target.getArmor() > 0) {
      target.setArmor(-DestroyArmor.data.value);

      this.addReportEvent(destArm, source.getName(), DestroyArmor.data.value);
    }

    const LinkedAttack = source.getMods().find((mod) => mod.getEffect('LinkedAttack'));
    if (LinkedAttack) {
      const otherWeapon = source.getMods().find((mod) => mod.isWeapon() && mod !== weapon);

      const effect = LinkedAttack.getEffect('LinkedAttack');
      if (otherWeapon && checkPercentage(effect.data.chance)) {
        this.addReportEvent(linkedAttackDesc);

        return this.attack({
          source,
          target,
          weapon: otherWeapon,
        });
      }
    }

    if (this.getWinner()) {
      this.end();
    }
  }

  criticalDamageStep(attack) {
    const { weapon, target, source } = attack;
    // Get critical
    const critical = weapon.getCriticalCalc()(source.getCritical());
    const isCritical = checkPercentage(critical);
    if (!isCritical) {
      this.addReportEvent(crtDmgFailed, weapon, critical);

      return;
    }
    // Get critical resist
    const criticalResist = weapon.getCriticalResistCalc()(target.getCriticalResist());
    const isResist = checkPercentage(criticalResist);

    if (isResist) {
      this.addReportEvent(crtDmgFailed2, weapon, critical, criticalResist);

      return;
    }

    const criticalDamage = weapon.getCriticalDamageCalc()(source.getCriticalDamage());

    this.addReportEvent(crtDmg, weapon, criticalDamage, critical, criticalResist);

    this.state.criticalDamage = criticalDamage;
  }

  evasionStep(attack) {
    const { weapon, target } = attack;

    const evasion = weapon.getEvasionCalc(target)(target.getEvasion(), weapon.getDamageTypes());

    this.state.evasionChance = evasion;
    this.state.isEvasion = checkPercentage(evasion);
  }

  attackShieldStep(attack) {
    const { weapon, target } = attack;
    const critical = (this.state.criticalDamage / 100);

    // Original damage
    const originalDamage = weapon.currentStats.damagePerFire;

    // Less/Addition Damage to Shield
    const getShieldDamage = weapon.getShieldDamageCalc();
    // Max Health of opponent as damage
    const maxHealthDamage = weapon.getMaxHealthDamageCalc()(target.getMaxHeatPoints());
    const shieldDamage = !target.state.shieldBroken ? getShieldDamage(originalDamage) * critical : 0;
    if (shieldDamage > 0) {
      this.addReportEvent(shieldDamageBonus, weapon, shieldDamage);
    }

    const damage =
      (originalDamage +
      maxHealthDamage) * critical;

    // const damage =
    //   additionalDamage +
    //   weaponDamage +
    //   originalDamage +
    //   armorDamage +
    //   maxHealthDamage +
    //   damageTypeBonus +
    //   criticalDamage;
    this.addReportEvent(
      shieldDamageRep,
      originalDamage,
      maxHealthDamage,
      this.state.criticalDamage / 100,
      damage
    );

    const shieldPoints = target.getShieldPoints();
    const currentShieldPoints = Math.max(shieldPoints - shieldDamage, 0);

    this.setLeftDamage(damage - currentShieldPoints);
    target.setShieldPoints(-(damage + shieldDamage));

    this.state.shieldBlocked +=
      damage + shieldDamage - shieldPoints > 0 ? currentShieldPoints : damage;

    if (!target.state.shieldBroken) {
      this.addReportEvent(shAtt, weapon, shieldPoints, this.getLeftDamage(), shieldDamage);
      this.addReportEvent(shAttExp, 'shp', damage, currentShieldPoints);
    }

    if (target.getShieldPoints() <= 0 && !target.state.shieldBroken) {
      this.addReportEvent(brokenShield, target.getName());

      target.state.shieldBroken = true;
    }
  }

  attackArmorStep(attack) {
    const { weapon, target, source } = attack;

    const damage = this.getLeftDamage();
    const armor = weapon.getArmorCalc()(target.getArmor());

    // Original damage
    const originalDamage = weapon.currentStats.damagePerFire;
    const critical = (this.state.criticalDamage / 100);

    // Weapon damage
    const weaponDamage = weapon.getDamage(this.state.time)(originalDamage);
    // Armor Damage Bonus
    const armorDamage = weapon.getArmorDamageCalc(target.getArmor())(originalDamage);
    // Damage Debuffs
    const damageDebuffs = source.getDebuffs(DamageTimeDebuff).filter((debuff) => !debuff.isUsed());
    const additionalDamage = damageDebuffs.reduce((a, c) => a + c.use(originalDamage), 0);
    // Damage Type Bonus
    const damageTypeBonus = source.getDamageTypeCalc(weapon)(
      originalDamage,
      weapon.getDamageTypes()
    );
    const realDamage = damage + (weaponDamage + armorDamage + additionalDamage + damageTypeBonus) * critical;

    this.addReportEvent(
      armDamageRep,
      damage,
      weaponDamage,
      this.state.criticalDamage / 100,
      armorDamage,
      damageTypeBonus,
      realDamage
    );


    const leftDamage = Math.max(realDamage - armor, realDamage * 0.25);

    this.setLeftDamage(leftDamage);
    this.state.armorBlocked += armor;

    const isMinimum = realDamage - armor < realDamage * 0.25;

    this.addReportEvent(armAtt, weapon, armor, this.getLeftDamage());
    this.addReportEvent(armAttExp, 'arm', realDamage, armor, isMinimum, leftDamage);
  }

  attackHPStep(attack) {
    const { weapon, source, target } = attack;

    const damage = this.getLeftDamage();
    const hp = target.getHeatPoints();

    const getHPDamage = weapon.getHPDamageCalc();
    const hpDamage = getHPDamage(damage);
    if (hpDamage > 0) {
      this.addReportEvent(hpDamageBonus, weapon, hpDamage);
    }

    const currentHPPoints = Math.max(hp - hpDamage, 0);

    target.setHeatPoints(-(damage + hpDamage));

    this.addReportEvent(hpAtt, weapon, currentHPPoints);
    this.addReportEvent(hpAttExp, 'hp', currentHPPoints, damage);

    const DamageTimeDebuffEffects = source
      .getMods()
      .flatMap((item) => item.getEffect('DamageTimeDebuff') || []);
    DamageTimeDebuffEffects.forEach((effect) => {
      target.addDebuff(new DamageTimeDebuff(effect.data));

      this.addReportEvent(damageTimeEffect, target.getName(), effect.data.change);
    });

    const CanFullRecoverEffects = this.mods.flatMap((mod) => mod.getEffect('CanFullRecover') || []);

    for (const effect of CanFullRecoverEffects) {
      const isSuccess = checkPercentage(effect.data.chance);
      if (!isSuccess) return;

      target.setHeatPoints(Infinity); // Infinity
      this.addReportEvent(fullRecoverEffect, target.getName());
    }

    const SufferAttackEffects = target
      .getMods()
      .flatMap((mod) => mod.getEffect('SufferAttack') || []);

    for (const effect of SufferAttackEffects) {
      const hp = source.getHeatPoints();
      source.setHeatPoints(-effect.data.damage);

      this.addReportEvent(sufferAttackEffect, target.getName(), effect.data.damage);
      this.addReportEvent(hpAttExp, 'hp', hp, effect.data.damage);
    }

    const ElectricUpdateModStatDebuffs = source.getMods().flatMap((mod) => mod.getEffect('ElectricUpdateModStatDebuff') || []);

    for (const effect of ElectricUpdateModStatDebuffs) {
      if (source.addDebuff(new ElectricUpdateModStatDebuff(effect.data, this.state.time))) {
        this.addReportEvent(electricStartEffect, target.getName());
      }
    }
  }

  attackVoidDamage() {
    const attacks = this.sortAttacks([
      { source: this.battleflies[0] },
      { source: this.battleflies[1] },
    ]);

    for (const attack of attacks) {
      const { source } = attack;

      const damage = this.state.voidDamage;
      const hp = source.getHeatPoints();

      source.setHeatPoints(-damage);

      this.addReportEvent(voidAtt, source.getName(), damage);
      this.addReportEvent(voidAttExp, 'hp', hp, damage);

      if (this.getWinner()) {
        this.end();

        break;
      }
    }

    this.state.voidDamage++;
  }

  debuffStep(bf) {
    const BurnDebuffs = bf
      .getDebuffs(BurnDebuff)
      .filter((debuff) => (this.state.time.get() % debuff.getBurnedTime()) % Time.SCALE === 0);

    BurnDebuffs.forEach((debuff) => {
      const hp = bf.getHeatPoints();

      bf.setHeatPoints(-debuff.getDamage());

      this.addReportEvent(burnEffect, bf.getName(), debuff.getDamage());
      this.addReportEvent(hpAttExp, 'hp', hp, debuff.getDamage());
    });
  }

  recoverStep(battlefly) {
    const time = this.state.time.get();
    if (!time || time % Time.SCALE !== 0) return;

    if(battlefly.getDebuffs(FrizeDebuff).filter((db) => db && !db.isUsed(this.state.time)).length > 0) {
      return;
    }

    const hp = battlefly.getMaxHeatPoints();
    const hprg = battlefly.getHeatPointsRegen();

    battlefly.setHeatPoints(hp * (hprg / 100));

    if (hprg > 0) {
      this.addReportEvent(hpRecover, battlefly.getName(), hp * (hprg / 100), hprg);
    }

    if (!battlefly.state.shieldBroken) {
      const shp = battlefly.getMaxShieldPoints();
      const shrg = battlefly.getShieldPointsRegen();
      battlefly.setShieldPoints(shp * (shrg / 100));

      if (shrg > 0) {
        this.addReportEvent(shpRecover, battlefly.getName(), shp * (shrg / 100), shrg);
      }
    }
  }

  async start() {
    const self = this;

    return new Promise((resolve) => {
      setTimeout(function next() {
        self.state.time = new Time();
        self.addReportEvent(battleStarted);

        let wasDamage = false;
        let voidStarted = false;

        let i = 0;
        while (true) {
          if(i > 100000) break;
          wasDamage = false;

          if (self.state.time.getValue() >= 50 && !voidStarted) {
            self.addReportEvent(voidStart);

            voidStarted = true;
          }

          if (self.state.time.getValue() >= 60 && self.state.time.get() % (1 * Time.SCALE) === 0) {
            self.attackVoidDamage();

            wasDamage = true;
          }

          const attacks = self.getAttacksForThisStep();

          for (const attack of attacks) {
            self.attack(attack);
          }

          if (attacks.length || wasDamage) {
            self.battleflies.forEach((bf) =>
              self.addReportEvent(hpStatus, bf.getName(), bf.getHeatPoints())
            );

            self.battleflies.forEach((bf) =>
              self.addReportEvent(shpStatus, bf.getName(), bf.getShieldPoints())
            );
          }

          if (self.getWinner()) {
            self.end();

            if (self.getWinner()) {
              self.addReportEvent(winnerReport, self.getWinner().getName());

              resolve();
              break;
            }
          }

          self.battleflies.forEach((bf) => self.debuffStep(bf));
          self.battleflies.forEach((bf) => self.recoverStep(bf));

          if (self.getWinner()) {
            self.end();

            if (self.getWinner()) {
              self.addReportEvent(winnerReport, self.getWinner().getName());
              resolve();

              break;
            }
          }

          self.nextStep();
        }
      }, 0);
    });
  }

  sortAttacks(attacks) {
    return attacks.sort((a, b) => {
      const sensorsArrayA = a.source.getSensorsCharacteristics();
      const sensorsArrayB = b.source.getSensorsCharacteristics();

      if (sensorsArrayA !== sensorsArrayB) {
        return sensorsArrayB - sensorsArrayA;
      }

      const levelA = a.source.getLevel();
      const levelB = b.source.getLevel();

      if (levelA !== levelB) {
        return levelB - levelA;
      }

      const powerRatingA = getBattleflyPowerRating(a.source, a.source.getMods());
      const powerRatingB = getBattleflyPowerRating(b.source, b.source.getMods());

      return powerRatingB - powerRatingA;
    });
  }

  nextStep() {
    this.state.time.addTime(0.01);
  }

  addReportEvent(type, ...args) {
    function getFlored(value) {
      return value;
    }

    this.report[getFlored(this.state.time.get())] = (
      this.report[getFlored(this.state.time.get())] || []
    ).concat({
      time: this.state.time.get(),
      turn: this.state.turn,
      attackerName: this.state.attack?.source?.getName() || null,
      weaponName: this.state.attack?.weapon?.getName() || null,
      weapon: this.state.attack?.weapon || null,
      event: type(...args),
    });
  }

  setLeftDamage(value) {
    this.state.leftDamage = Math.max(value, 0);
  }

  getLeftDamage() {
    return this.state.leftDamage;
  }
}

export async function generateBattleReport(firstBattlefly, secondBattlefly) {
  const fBattleflySnapshot = new BattleflySnapshot(firstBattlefly);
  const sBattleflySnapshot = new BattleflySnapshot(secondBattlefly);

  const battle = new Battle([fBattleflySnapshot, sBattleflySnapshot]);
  await battle.start();

  return [
    fBattleflySnapshot,
    sBattleflySnapshot,
    battle.report,
    { winner: battle.getWinner(), duration: battle.state.time.get() },
  ];
}
