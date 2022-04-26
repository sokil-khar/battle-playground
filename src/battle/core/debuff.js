import { StatsData } from "../../data/constants";
import {Time} from "./time";

export class Effect {
  constructor(raw, owner) {
    Object.assign(this, raw);

    this.used = false;
    this.owner = owner;
  }

  getBattlefly() {
    return this.owner.owner;
  }

  getType() {
    return this.type;
  }

  getAttributeName() {
    return this.data.attributeName;
  }

  getAttributeValue() {
    return this.data.attributeValue;
  }

  isUsed() {
    return this.used;
  }

  use() {
    this.used = true;
  }
}

export class FrizeDebuff {
  constructor(data, time) {
    this.duration = data.duration;

    this.endTime = new Time(time.getValue());
    this.endTime.addTime(this.duration);
  }

  cumulative(item) {
    return item;
  }

  isUsed(time) {
    return this.endTime.value <= time.value;
  }
}

export class BurnDebuff {
  constructor(data, time) {
    this.damage = data.damage;
    this.burnedTime = time.get();
  }

  cumulative(item) {
    this.damage += item.getDamage();

    return this;
  }

  getBurnedTime() {
    return this.burnedTime;
  }

  getDamage() {
    return this.damage;
  }

  isUsed(time) {
    return false;
  }
}

export class EmpDebuff {
  constructor(data, time) {
    this.duration = time.get();
  }

  cumulative(item) {
    return this;
  }

  getBurnedTime() {
    return this.duration;
  }

  isUsed(time) {
    return false;
  }
}

export class CancelAttackDebuff {
  constructor(data) {
    this.damageType = data.damageType;
    this.times = data.times;
    this.used = 0;
  }

  cumulative() {
    return this;
  }

  getDamageType() {
    return this.damageType;
  }

  getTimes() {
    return this.times;
  }

  use() {
    this.used++;
  }

  isUsed() {
    return this.times <= this.used;
  }
}

export class VirusDebuff {
  constructor(data) {
    this.updates = data.updates;
  }

  cumulative() {
    return this;
  }

  use(target) {
    const updates = [];

    this.updates.forEach((update) => {
      if (!update.current) {
        update.current = 0;
      }

      if (update.current <= update.max) {
        return;
      }

      update.current = Math.max(update.max, update.current + update.change);

      target.currentStats[update.stat] = Math.max(
        0,
        target.currentStats[update.stat] + update.current
      );

      updates.push([StatsData[update.stat].name, update.current]);
    });

    return updates;
  }

  isUsed() {
    return false;
  }
}

export class UpdateModStatDebuff {
  constructor(data) {
    this.healthPercentage = data.healthPercentage;
    this.stat = data.attributeName;
    this.value = data.attributeValue;
  }

  cumulative(item) {
    return item;
  }

  getValue() {
    return this.value;
  }

  getStat() {
    return this.stat;
  }

  isUsed(battlefly) {
    return (
      (battlefly.getHeatPoints() * 100) / battlefly.getMaxHeatPoints() <= this.healthPercentage
    );
  }
}

export class ElectricUpdateModStatDebuff {
  constructor(data, time) {
    this.endTime = new Time(time.getValue());
    this.endTime.addTime(data.duration);

    this.stat = data.attributeName;
    this.value = data.attributeValue;
    this.percentage = true;
  }

  cumulative(debuff) {
    if(this.value === null) {
      return debuff;
    } else {
      this.value = Math.max(-20, this.value + debuff.getValue());
    }

    return this;
  }

  getValue() {
    return this.value;
  }

  getStat() {
    return this.stat;
  }

  isUsed(time) {
    if(this.endTime.value <= time.value) {
      this.value = null;

      return true;
    }

    return false;
  }
}

export class DamageTimeDebuff {
  constructor(data) {
    this.times = data.times;
    this.change = data.change;
    this.used = 0;
  }

  cumulative(debuff) {
    if (debuff.change === this.change) {
      if (!this.isUsed()) return this;

      this.times += debuff.times;

      return this;
    }

    return debuff;
  }

  use(damage) {
    this.used++;

    return damage * (this.change / 100);
  }

  isUsed() {
    return this.times <= this.used;
  }
}

export class RevertAttackDebuff {
  constructor(data) {
    this.used = 0;
    this.maxUsed = 1;
    this.chance = data.chance;
  }

  cumulative() {
    this.maxUsed++;

    return this;
  }

  getChance() {
    return this.chance;
  }

  use() {
    this.used++;
  }

  isUsed() {
    return this.used >= this.maxUsed;
  }
}

export const DebuffMap = {
  CancelAttackDebuff,
  VirusDebuff,
};
