function createUpdateStatEffect(attributeName, attributeValue, percentage = false, target = null) {
  return {
    type: 'UpdateStat',
    data: {
      attributeName,
      attributeValue,
      attributeTarget: target,
      percentage,
    },
  };
} // + gotovo

function createEvasionEffect(value, damageTypes = null, percentage = true) {
  return {
    type: 'UpdateStat',
    data: {
      attributeName: 'eva',
      attributeValue: value,
      percentage,
      damageTypes,
    },
  };
} // + gotovo

function createDamageTimeDebuff(times, change) {
  return {
    type: 'DamageTimeDebuff',
    data: {
      times,
      change,
    },
  };
} // + gotovo

function createArmorDamage(damage, percentage = false) {
  return {
    type: 'ArmorDamage',
    data: {
      arm: 1,
      dmg: damage,
      percentage,
    },
  };
} // + gotovo

function battleflyStat(attributeName, attributeValue, percentage = false) {
  return {
    type: 'BattleflyStat',
    data: {
      attributeName,
      attributeValue,
      percentage,
    },
  };
} // + gotovo

function modStat(attributeName, attributeValue, percentage = false) {
  return {
    type: 'ModStat',
    data: {
      attributeName,
      attributeValue,
      percentage,
    },
  };
} // + gotovo

function createFreezeDebuff(duration) {
  return {
    type: 'FreezeDebuff',
    data: {
      duration,
    },
  };
}

function createBurnDebuff(damage) {
  return {
    type: 'BurnDebuff',
    data: {
      damage,
    },
  };
} // + gotovo

function createRevertAttack(chance) {
  return {
    type: 'RevertAttack',
    data: {
      chance,
    },
  };
} // + gotovo

function battleflyCharacteristic(attributeName, attributeValue) {
  return {
    type: 'UpdateCharacteristic',
    data: {
      attributeName,
      attributeValue,
    },
  };
} // + gotovo

function createDamageType(attributeName, attributeValue) {
  return {
    type: 'DamageType',
    data: {
      attributeName,
      attributeValue,
    },
  };
} // + gotovo

function createOtherDamageType(attributeName, attributeValue) {
  return {
    type: 'OtherDamageType',
    data: {
      attributeName,
      attributeValue,
    },
  };
} // + gotovo

function maxUsage(value) {
  return {
    type: 'MaxUsage',
    data: {
      value,
    },
  };
}

function freeAttack() {
  return {
    type: 'FreeAttack'
  };
}

function createDamageBoth() {
  return {
    type: 'DamageBoth',
  };
} // + gotovo

function createMaxHealthDamage(value) {
  return {
    type: 'MaxHealthDamage',
    data: {
      value,
    },
  };
} // + gotovo

function createCancelAttackDebuff(damageType, times) {
  return {
    type: 'CancelAttackDebuff',
    data: {
      damageType,
      times,
    },
  };
}

function createFullRecoverChance(chance) {
  return {
    type: 'CanFullRecover',
    data: {
      chance,
    },
  };
} // + gotovo

function createLinkedAttackChance(chance) {
  return {
    type: 'LinkedAttack',
    data: {
      chance,
    },
  };
}

function createFirstAttackShield() {
  return {
    type: 'FirstAttackShield',
  };
} // + gotovo

function createHealthModStat(healthPercentage, attributeName, attributeValue) {
  return {
    type: 'UpdateModStatDebuff',
    data: {
      type: 'health',
      healthPercentage,
      attributeName,
      attributeValue,
    },
  };
} // + gotovo


function createElectricModStat(attributeName, attributeValue) {
  return {
    type: 'ElectricUpdateModStatDebuff',
    data: {
      duration: 3,
      attributeName,
      attributeValue,
    },
  };
} // + gotovo
function createLinkedSuffer(damage) {
  return {
    type: 'Suffer',
    data: {
      damage,
    },
  };
} // + gotovo

function resurrect(healthPercentage) {
  return {
    type: 'Resurrect',
    data: {
      healthPercentage,
    },
  };
} // + gotovo

function nuclearDamage() {
  return {
    type: 'NuclearDamage',
  };
} // + gotovo

function critUpdate(value) {
  return {
    type: 'CritUpdate',
    data: {
      value
    }
  }
} // + gotovo

function evaUpdate(value) {
  return {
    type: 'EvaUpdate',
    data: {
      value
    }
  };
} // + gotovo

function destroyArmor(value) {
  return {
    type: 'DestroyArmor',
    data: {
      value,
    },
  };
}

function createVirusDebuff(updates) {
  return {
    type: 'VirusDebuff',
    data: {
      updates,
    },
  };
}

export const effects = [
  {
    name: 'Autocannon I',
    effects: [createUpdateStatEffect('damagePerFire', 50, true, 'Shield')],
  },
  {
    name: 'Howitzer I',
    effects: [createUpdateStatEffect('damagePerFire', 15, true, 'Shield')],
  },
  {
    name: 'Mining Laser I',
    effects: [destroyArmor(0.5)],
  },
  {
    name: 'Hunter Missiles I',
    effects: [createEvasionEffect(-100)],
  },
  {
    name: 'Hunter Missiles I',
    effects: [createEvasionEffect(-100)],
  },
  {
    name: 'Lightning Probe II',
    effects: [createUpdateStatEffect('damagePerFire', -40, true, 'Shield')],
  },
  {
    name: 'Lightning Probe III',
    effects: [createUpdateStatEffect('damagePerFire', -30, true, 'Shield')],
  },
  {
    name: 'Lightning Probe IV',
    effects: [createUpdateStatEffect('damagePerFire', -25, true, 'Shield')],
  },
  {
    name: 'Electroblast Zapper',
    effects: [
      createUpdateStatEffect('damagePerFire', -15, true, 'Shield'),
      createDamageTimeDebuff(1, -15),
    ],
  },
  {
    name: 'Gravity Gun III',
    effects: [createArmorDamage(3)],
  },
  {
    name: 'Gravity Gun IV',
    effects: [createArmorDamage(3)],
  },
  {
    name: 'Zero Point Energy Dislocator',
    effects: [createArmorDamage(3)],
  },
  {
    name: 'Monofilament Spinner II',
    effects: [createUpdateStatEffect('crit', 20)],
  },
  {
    name: 'Monofilament Spinner III',
    effects: [createUpdateStatEffect('crit', 22)],
  },
  {
    name: 'Monofilament Spinner IV',
    effects: [createUpdateStatEffect('crit', 25)],
  },
  {
    name: 'Superslicer Rotator G2000',
    effects: [createUpdateStatEffect('crit', 25), createUpdateStatEffect('dcrit', 20)],
  },
  {
    name: 'EMP Blaster II',
    effects: [createFreezeDebuff(1.5)],
  },
  {
    name: 'EMP Blaster III',
    effects: [createFreezeDebuff(1.6)],
  },
  {
    name: 'EMP Blaster IV',
    effects: [createFreezeDebuff(1.7)],
  },
  {
    name: 'Electromagnetic Destabilization Sphere',
    effects: [createFreezeDebuff(1.9)],
  },
  {
    name: 'Hacking Ray III',
    effects: [createRevertAttack(55)],
  },
  {
    name: 'Hacking Ray IV',
    effects: [createRevertAttack(65)],
  },
  {
    name: 'XPLOIT infiltration device',
    effects: [createRevertAttack(75)],
  },
  {
    name: 'ACS Probe II',
    effects: [
      createVirusDebuff([
        {
          stat: 'crit',
          change: -5,
          max: -50,
        },
        {
          stat: 'eva',
          change: -5,
          max: -50,
        },
      ]),
    ],
  },
  {
    name: 'ACS Probe III',
    effects: [
      createVirusDebuff([
        {
          stat: 'crit',
          change: -8,
          max: -55,
        },
        {
          stat: 'eva',
          change: -8,
          max: -55,
        },
      ]),
    ],
  },
  {
    name: 'ACS Probe IV',
    effects: [
      createVirusDebuff([
        {
          stat: 'crit',
          change: -12,
          max: -60,
        },
        {
          stat: 'eva',
          change: -12,
          max: -60,
        },
      ]),
    ],
  },
  {
    name: 'ILOVEU2 Probe',
    effects: [
      createVirusDebuff([
        {
          stat: 'crit',
          change: -18,
          max: -70,
        },
        {
          stat: 'eva',
          change: -18,
          max: -70,
        },
      ]),
    ],
  },
  {
    name: 'Mini Gun II',
    effects: [destroyArmor(0.7)],
  },
  {
    name: 'Mini Gun III',
    effects: [destroyArmor(0.8)],
  },
  {
    name: 'Mini Gun IV',
    effects: [destroyArmor(0.9)],
  },
  {
    name: 'Greased Gatling Gator',
    effects: [
      createUpdateStatEffect('damagePerFire', 35, true, 'Shield'),
      battleflyStat('crit', 1),
    ],
  },
  {
    name: 'Flak Gun II',
    effects: [createEvasionEffect(-20)],
  },
  {
    name: 'Flak Gun III',
    effects: [createEvasionEffect(-25)],
  },
  {
    name: 'Flak Gun IV',
    effects: [createEvasionEffect(-25)],
  },
  {
    name: 'Supersonic Flak Launcher',
    effects: [createEvasionEffect(-100), battleflyCharacteristic('engines', 2)],
  },
  {
    name: 'Railgun II',
    effects: [createUpdateStatEffect('damagePerFire', 20, true, 'Shield')],
  },
  {
    name: 'Railgun III',
    effects: [createUpdateStatEffect('damagePerFire', 20, true, 'Shield')],
  },
  {
    name: 'Railgun IV',
    effects: [createUpdateStatEffect('damagePerFire', 20, true, 'Shield')],
  },
  {
    name: 'Rapid-Fire Rolling Chamber',
    effects: [createUpdateStatEffect('damagePerFire', 45, true, 'Shield')],
  },
  {
    name: 'Autocannon II',
    effects: [createUpdateStatEffect('damagePerFire', 60, true, 'Shield')],
  },
  {
    name: 'Autocannon III',
    effects: [createUpdateStatEffect('damagePerFire', 70, true, 'Shield')],
  },
  {
    name: 'Autocannon IV',
    effects: [createUpdateStatEffect('damagePerFire', 75, true, 'Shield')],
  },
  {
    name: 'Low-Frequency Proton Cannon',
    effects: [createUpdateStatEffect('damagePerFire', 80, true, 'Shield')],
  },
  {
    name: 'Howitzer II',
    effects: [createUpdateStatEffect('damagePerFire', 20, true, 'Shield')],
  },
  {
    name: 'Howitzer III',
    effects: [createUpdateStatEffect('damagePerFire', 25, true, 'Shield')],
  },
  {
    name: 'Howitzer IV',
    effects: [createUpdateStatEffect('damagePerFire', 30, true, 'Shield')],
  },
  {
    name: 'Chaos Fusion Disintegrator',
    effects: [createUpdateStatEffect('damagePerFire', 40, true, 'Shield')],
  },
  {
    name: 'Mining Laser II',
    effects: [destroyArmor(0.7)],
  },
  {
    name: 'Mining Laser III',
    effects: [destroyArmor(0.8)],
  },
  {
    name: 'Mining Laser IV',
    effects: [destroyArmor(0.9)],
  },
  {
    name: 'Powered Pulse Phaser',
    effects: [destroyArmor(1)],
  },
  {
    name: 'Proton Blaster II',
    effects: [],
  },
  {
    name: 'Proton Blaster III',
    effects: [],
  },
  {
    name: 'Proton Blaster IV',
    effects: [],
  },
  {
    name: 'Veteran Meson Blaster',
    effects: [createDamageType('Energy', 5)],
  },
  {
    name: 'Laser Cannon II',
    effects: [createUpdateStatEffect('damagePerFire', 10, true, 'HP')],
  },
  {
    name: 'Laser Cannon III',
    effects: [createUpdateStatEffect('damagePerFire', 12, true, 'HP')],
  },
  {
    name: 'Laser Cannon IV',
    effects: [createUpdateStatEffect('damagePerFire', 14, true, 'HP')],
  },
  {
    name: 'Cataclysm Plasma Cannon',
    effects: [createUpdateStatEffect('damagePerFire', 20, true, 'HP')],
  },
  {
    name: 'Scatter Laser II',
    effects: [createUpdateStatEffect('arm', -50, true)],
  },
  {
    name: 'Scatter Laser III',
    effects: [createUpdateStatEffect('arm', -50, true)],
  },
  {
    name: 'Scatter Laser IV',
    effects: [createUpdateStatEffect('arm', -50, true)],
  },
  {
    name: 'Vortex Laser Equalizer',
    effects: [createUpdateStatEffect('arm', -60, true)],
  },
  {
    name: 'Plasma Spear II',
    effects: [createArmorDamage(2, true)],
  },
  {
    name: 'Plasma Spear III',
    effects: [createArmorDamage(2, true)],
  },
  {
    name: 'Plasma Spear IV',
    effects: [createArmorDamage(2, true)],
  },
  {
    name: 'Augmented Proton Eraser',
    effects: [createArmorDamage(2, true)],
  },
  {
    name: 'Nova Flak Flare II',
    effects: [battleflyStat('arm', 10, true)],
  },
  {
    name: 'Nova Flak Flare III',
    effects: [battleflyStat('arm', 10, true)],
  },
  {
    name: 'Nova Flak Flare IV',
    effects: [battleflyStat('arm', 10, true)],
  },
  {
    name: 'Discharge Anti-Matter Nova Flare',
    effects: [battleflyStat('arm', 15, true)],
  },
  {
    name: 'Microwave Emitter III',
    effects: [createUpdateStatEffect('arm', -100, true), createEvasionEffect(-100)],
  },
  {
    name: 'Microwave Emitter IV',
    effects: [createUpdateStatEffect('arm', -100, true), createEvasionEffect(-100)],
  },
  {
    name: 'Cosmic Equalizer',
    effects: [
      createUpdateStatEffect('arm', -100, true),
      createEvasionEffect(-100),
      battleflyCharacteristic('fusionBattery', 3),
    ],
  },
  {
    name: 'Hunter Missiles II',
    effects: [createEvasionEffect(-100)],
  },
  {
    name: 'Hunter Missiles III',
    effects: [createEvasionEffect(-100)],
  },
  {
    name: 'Hunter Missiles IV',
    effects: [createEvasionEffect(-100)],
  },
  {
    name: 'Self-Guided Gravity Disintegrators',
    effects: [createEvasionEffect(-100), battleflyCharacteristic('cpu', 3)],
  },
  {
    name: 'Micro Rocket Pods II',
    effects: [],
  },
  {
    name: 'Micro Rocket Pods III',
    effects: [],
  },
  {
    name: 'Micro Rocket Pods IV',
    effects: [],
  },
  {
    name: 'Astral Proton Rockets',
    effects: [createOtherDamageType('Kinetic', 15)],
  },
  {
    name: 'Long Range Micromissiles II',
    effects: [freeAttack(1)],
  },
  {
    name: 'Long Range Micromissiles III',
    effects: [freeAttack(1)],
  },
  {
    name: 'Long Range Micromissiles IV',
    effects: [freeAttack(1)],
  },
  {
    name: 'Nail Biter F2M2 Missiles',
    effects: [freeAttack(1)],
  },
  {
    name: 'Rocket Pods II',
    effects: [createUpdateStatEffect('damagePerFire', 25, true, 'Shield')],
  },
  {
    name: 'Rocket Pods III',
    effects: [createUpdateStatEffect('damagePerFire', 25, true, 'Shield')],
  },
  {
    name: 'Rocket Pods IV',
    effects: [createUpdateStatEffect('damagePerFire', 25, true, 'Shield')],
  },
  {
    name: 'Heavy Flux Photon Rockets',
    effects: [
      createUpdateStatEffect('damagePerFire', 50, true, 'Shield'),
      createArmorDamage(5, true),
    ],
  },
  {
    name: 'Hammerhead Missiles II',
    effects: [
      createUpdateStatEffect('arm', -100, true),
      createUpdateStatEffect('damagePerFire', 50, true, 'Shield'),
    ],
  },
  {
    name: 'Hammerhead Missiles III',
    effects: [
      createUpdateStatEffect('arm', -100, true),
      createUpdateStatEffect('damagePerFire', 50, true, 'Shield'),
    ],
  },
  {
    name: 'Hammerhead Missiles IV',
    effects: [
      createUpdateStatEffect('arm', -100, true),
      createUpdateStatEffect('damagePerFire', 50, true, 'Shield'),
    ],
  },
  {
    name: 'Supernova Neon Revolutionizers',
    effects: [
      createUpdateStatEffect('arm', -100, true),
      createUpdateStatEffect('damagePerFire', 50, true, 'Shield'),
      createOtherDamageType('Energy', 15),
    ],
  },
  {
    name: 'Micro Nuke III',
    effects: [createDamageBoth(), maxUsage(1)],
  },
  {
    name: 'Micro Nuke IV',
    effects: [createDamageBoth(), maxUsage(1)],
  },
  {
    name: 'Emissary of the End',
    effects: [createDamageBoth(), maxUsage(1)],
  },
  {
    name: 'Rad Blaster II',
    effects: [createBurnDebuff(20)],
  },
  {
    name: 'Rad Blaster III',
    effects: [createBurnDebuff(25)],
  },
  {
    name: 'Rad Blaster IV',
    effects: [createBurnDebuff(30)],
  },
  {
    name: 'Nuclear Firestorm',
    effects: [createBurnDebuff(35)],
  },
  {
    name: 'Micro Black Hole Turbine III',
    effects: [createMaxHealthDamage(5)],
  },
  {
    name: 'Micro Black Hole Turbine IV',
    effects: [createMaxHealthDamage(7)],
  },
  {
    name: 'Radiated Nuclear Abyss Generator',
    effects: [createMaxHealthDamage(10)],
  },
  {
    name: 'Plasteel Hull II',
    effects: [battleflyStat('hp', 12, true)],
  },
  {
    name: 'Plasteel Hull III',
    effects: [battleflyStat('hp', 20, true)],
  },
  {
    name: 'Plasteel Hull IV',
    effects: [battleflyStat('hp', 28, true)],
  },
  {
    name: 'Plasteel Hull V',
    effects: [battleflyStat('hp', 40, true), createDamageType('Missile', 5)],
  },
  {
    name: 'Boosters Thrusters II',
    effects: [battleflyStat('eva', 9)],
  },
  {
    name: 'Boosters Thrusters III',
    effects: [battleflyStat('eva', 12)],
  },
  {
    name: 'Boosters Thrusters IV',
    effects: [battleflyStat('eva', 14)],
  },
  {
    name: 'Boosters Thrusters V',
    effects: [battleflyStat('eva', 15), createDamageType('Electric', 5)],
  },
  {
    name: 'Ceramo Armor II',
    effects: [],
  },
  {
    name: 'Ceramo Armor III',
    effects: [battleflyStat('hp', 5, true)],
  },
  {
    name: 'Ceramo Armor IV',
    effects: [battleflyStat('hp', 10, true)],
  },
  {
    name: 'Ceramo Armor V',
    effects: [battleflyStat('hp', 15, true)],
  },
  {
    name: 'Point Defense II',
    effects: [createEvasionEffect(19, ['Missile'])],
  },
  {
    name: 'Point Defense III',
    effects: [createEvasionEffect(27, ['Missile'])],
  },
  {
    name: 'Point Defense IV',
    effects: [createEvasionEffect(35, ['Missile'])],
  },
  {
    name: 'Point Defense V',
    effects: [createEvasionEffect(45, ['Missile']), createDamageType('Kinetic', 5)],
  },
  {
    name: 'Force Shield: A.T II',
    effects: [battleflyStat('shrg', 1)],
  },
  {
    name: 'Force Shield: A.T III',
    effects: [battleflyStat('shrg', 2)],
  },
  {
    name: 'Force Shield: A.T IV',
    effects: [battleflyStat('shrg', 3)],
  },
  {
    name: 'Force Shield: A.T V',
    effects: [battleflyStat('shrg', 5)],
  },
  {
    name: 'Force Shield: N.X II',
    effects: [battleflyStat('shrg', 2)],
  },
  {
    name: 'Force Shield: N.X III',
    effects: [battleflyStat('shrg', 4)],
  },
  {
    name: 'Force Shield: N.X IV',
    effects: [battleflyStat('shrg', 6)],
  },
  {
    name: 'Force Shield: N.X V',
    effects: [battleflyStat('shrg', 9), battleflyCharacteristic('fusionBattery', 2)],
  },
  {
    name: 'Force Shield: Warp II',
    effects: [battleflyStat('shrg', 4)],
  },
  {
    name: 'Force Shield: Warp III',
    effects: [battleflyStat('shrg', 6)],
  },
  {
    name: 'Force Shield: Warp IV',
    effects: [battleflyStat('shrg', 8)],
  },
  {
    name: 'Force Shield: Warp V',
    effects: [battleflyStat('shrg', 9), battleflyCharacteristic('engines', 2)],
  },
  {
    name: 'Biohazard Shield III',
    effects: [createEvasionEffect(25, ['Electric', 'Nuclear'])],
  },
  {
    name: 'Biohazard Shield IV',
    effects: [createEvasionEffect(35, ['Electric', 'Nuclear'])],
  },
  {
    name: 'Biohazard Shield V',
    effects: [createEvasionEffect(50, ['Electric', 'Nuclear'])],
  },
  {
    name: 'Wasteland Seals II',
    effects: [createEvasionEffect(19, ['Nuclear'])],
  },
  {
    name: 'Wasteland Seals III',
    effects: [createEvasionEffect(27, ['Nuclear'])],
  },
  {
    name: 'Wasteland Seals IV',
    effects: [createEvasionEffect(35, ['Nuclear'])],
  },
  {
    name: 'Wasteland Seals V',
    effects: [createEvasionEffect(80, ['Nuclear'])],
  },
  {
    name: 'Reactive Armor II',
    effects: [createCancelAttackDebuff('Kinetic', 3)],
  },
  {
    name: 'Reactive Armor III',
    effects: [createCancelAttackDebuff('Kinetic', 4)],
  },
  {
    name: 'Reactive Armor IV',
    effects: [createCancelAttackDebuff('Kinetic', 5)],
  },
  {
    name: 'Reactive Armor V',
    effects: [createCancelAttackDebuff('Kinetic', 7)],
  },
  {
    name: 'Explosive Ammo II',
    effects: [createDamageType('Kinetic', 15)],
  },
  {
    name: 'Explosive Ammo III',
    effects: [createDamageType('Kinetic', 25)],
  },
  {
    name: 'Explosive Ammo IV',
    effects: [createDamageType('Kinetic', 35)],
  },
  {
    name: 'Explosive Ammo V',
    effects: [createDamageType('Kinetic', 50)],
  },

  {
    name: 'EMP Ammo II',
    effects: [createElectricModStat('damagePerFire', -8)],
  },
  {
    name: 'EMP Ammo III',
    effects: [createElectricModStat('damagePerFire', -10)],
  },
  {
    name: 'EMP Ammo IV',
    effects: [createElectricModStat('damagePerFire', -12)],
  },
  {
    name: 'EMP Ammo V',
    effects: [createElectricModStat('damagePerFire', -20)],
  },
  {
    name: 'Auto Reloaders II',
    effects: [modStat('reload', 19, true)],
  },
  {
    name: 'Auto Reloaders III',
    effects: [modStat('reload', 27, true)],
  },
  {
    name: 'Auto Reloaders IV',
    effects: [modStat('reload', 35, true)],
  },
  {
    name: 'Auto Reloaders V',
    effects: [modStat('reload', 50, true)],
  },
  {
    name: 'Graviton Capacitors II',
    effects: [battleflyStat('shrg', 3)],
  },
  {
    name: 'Graviton Capacitors III',
    effects: [battleflyStat('shrg', 4)],
  },
  {
    name: 'Graviton Capacitors IV',
    effects: [battleflyStat('shrg', 5)],
  },
  {
    name: 'Graviton Capacitors V',
    effects: [battleflyStat('shrg', 8), battleflyCharacteristic('sensorsArray', 3)],
  },
  {
    name: 'Auxiliary Generators II',
    effects: [createFullRecoverChance(3)],
  },
  {
    name: 'Auxiliary Generators III',
    effects: [createFullRecoverChance(5)],
  },
  {
    name: 'Auxiliary Generators IV',
    effects: [createFullRecoverChance(7)],
  },
  {
    name: 'Auxiliary Generators V',
    effects: [createFullRecoverChance(10)],
  },
  {
    name: 'Combat Algorythms Processor II',
    effects: [battleflyStat('crit', 8)],
  },
  {
    name: 'Combat Algorythms Processor III',
    effects: [battleflyStat('crit', 10)],
  },
  {
    name: 'Combat Algorythms Processor IV',
    effects: [battleflyStat('crit', 12)],
  },
  {
    name: 'Combat Algorythms Processor V',
    effects: [battleflyStat('crit', 20)],
  },
  {
    name: 'Linked Combat Systems III',
    effects: [createLinkedAttackChance(10)],
  },
  {
    name: 'Stealth Tech III',
    effects: [createFirstAttackShield(), battleflyStat('eva', 5)],
  },
  {
    name: 'Stealth Tech IV',
    effects: [createFirstAttackShield(), battleflyStat('eva', 8)],
  },
  {
    name: 'Stealth Tech V',
    effects: [createFirstAttackShield(), battleflyStat('eva', 15)],
  },
  {
    name: 'Mirror Image Generators II',
    effects: [battleflyStat('rcrit', 19)],
  },
  {
    name: 'Mirror Image Generators III',
    effects: [battleflyStat('rcrit', 27)],
  },
  {
    name: 'Mirror Image Generators IV',
    effects: [battleflyStat('rcrit', 35)],
  },
  {
    name: 'Mirror Image Generators V',
    effects: [battleflyStat('rcrit', 45), battleflyCharacteristic('sensorsArray', 3)],
  },
  {
    name: 'Diamond Nuclear Voltaic Battery II',
    effects: [battleflyStat('eva', 2), battleflyStat('crit', 2), battleflyStat('hp', 2, true)],
  },
  {
    name: 'Diamond Nuclear Voltaic Battery III',
    effects: [battleflyStat('eva', 4), battleflyStat('crit', 4), battleflyStat('hp', 4, true)],
  },
  {
    name: 'Diamond Nuclear Voltaic Battery IV',
    effects: [battleflyStat('eva', 6), battleflyStat('crit', 6), battleflyStat('hp', 6, true)],
  },
  {
    name: 'Diamond Nuclear Voltaic Battery V',
    effects: [
      battleflyStat('eva', 10),
      battleflyStat('crit', 10),
      battleflyStat('hp', 10, true),
      modStat('reload', 10, true),
    ],
  },
  {
    name: 'Regenerative Nanobot II',
    effects: [battleflyStat('hprg', 0.5)],
  },
  {
    name: 'Regenerative Nanobot III',
    effects: [battleflyStat('hprg', 0.8)],
  },
  {
    name: 'Regenerative Nanobot IV',
    effects: [battleflyStat('hprg', 1.2)],
  },
  {
    name: 'Regenerative Nanobot V',
    effects: [battleflyStat('hprg', 1.7), battleflyStat('shrg', 2)],
  },
  {
    name: 'Overclocking protocols II',
    effects: [createHealthModStat(30, 'damagePerFire', 19), createHealthModStat(30, 'reload', -19)],
  },
  {
    name: 'Overclocking protocols III',
    effects: [createHealthModStat(30, 'damagePerFire', 27), createHealthModStat(30, 'reload', -27)],
  },
  {
    name: 'Overclocking protocols IV',
    effects: [createHealthModStat(30, 'damagePerFire', 35), createHealthModStat(30, 'reload', -35)],
  },
  {
    name: 'Overclocking protocols V',
    effects: [
      createHealthModStat(30, 'damagePerFire', 50),
      createHealthModStat(30, 'reload', -50),
      battleflyCharacteristic('nanoFrame', 3),
    ],
  },
  {
    name: 'Rage Against The Nano Machines II',
    effects: [modStat('damagePerFire', 8, true)],
  },
  {
    name: 'Rage Against The Nano Machines III',
    effects: [modStat('damagePerFire', 12, true)],
  },
  {
    name: 'Rage Against The Nano Machines IV',
    effects: [modStat('damagePerFire', 15, true)],
  },
  {
    name: 'Rage Against The Nano Machines V',
    effects: [modStat('damagePerFire', 25, true), battleflyStat('crit', 5)],
  },
  {
    name: 'Sharp Armored Components II',
    effects: [createLinkedSuffer(3)],
  },
  {
    name: 'Sharp Armored Components III',
    effects: [createLinkedSuffer(5)],
  },
  {
    name: 'Sharp Armored Components IV',
    effects: [createLinkedSuffer(7)],
  },
  {
    name: 'Sharp Armored Components V',
    effects: [createLinkedSuffer(10), battleflyStat('arm', 10, true)],
  },
  {
    name: 'Phoenix protocols IV',
    effects: [resurrect(20)],
  },
  {
    name: 'Leeeroy Chip 3.7 III',
    effects: [critUpdate(1)],
  },
  {
    name: 'Leeeroy Chip 3.7 IV',
    effects: [critUpdate(1)],
  },
  {
    name: 'Leeeroy Chip 3.7 V',
    effects: [critUpdate(1.5)],
  },
  {
    name: 'Red Panda protocols III',
    effects: [evaUpdate(1)],
  },
  {
    name: 'Red Panda protocols IV',
    effects: [evaUpdate(1)],
  },
  {
    name: 'Red Panda protocols V',
    effects: [evaUpdate(1)],
  },
  {
    name: 'Supersonic Sensor Radar III',
    effects: [battleflyCharacteristic('sensorsArray', 3)],
  },
  {
    name: 'Supersonic Sensor Radar IV',
    effects: [battleflyCharacteristic('sensorsArray', 4)],
  },
  {
    name: 'Supersonic Sensor Radar V',
    effects: [battleflyCharacteristic('sensorsArray', 5), modStat('reload', 10, true)],
  },
  {
    name: 'Promethium Neogenic Battery III',
    effects: [battleflyCharacteristic('fusionBattery', 3)],
  },
  {
    name: 'Promethium Neogenic Battery IV',
    effects: [battleflyCharacteristic('fusionBattery', 4)],
  },
  {
    name: 'Promethium Neogenic Battery V',
    effects: [battleflyCharacteristic('fusionBattery', 5)],
  },
  {
    name: 'Celsium Quantum Frame III',
    effects: [battleflyCharacteristic('nanoFrame', 3)],
  },
  {
    name: 'Celsium Quantum Frame IV',
    effects: [battleflyCharacteristic('nanoFrame', 4)],
  },
  {
    name: 'Celsium Quantum Frame V',
    effects: [battleflyCharacteristic('nanoFrame', 5)],
  },
  {
    name: 'Supercharged Jumpdrive Engine III',
    effects: [battleflyCharacteristic('engines', 3)],
  },
  {
    name: 'Supercharged Jumpdrive Engine IV',
    effects: [battleflyCharacteristic('engines', 4)],
  },
  {
    name: 'Supercharged Jumpdrive Engine V',
    effects: [battleflyCharacteristic('engines', 5)],
  },
  {
    name: 'Gold-Plated Hyper CPU III',
    effects: [battleflyCharacteristic('cpu', 3)],
  },
  {
    name: 'Gold-Plated Hyper CPU IV',
    effects: [battleflyCharacteristic('cpu', 4)],
  },
  {
    name: 'Gold-Plated Hyper CPU V',
    effects: [battleflyCharacteristic('cpu', 5)],
  },
  {
    name: 'Nano Go Neuronet II',
    effects: [],
  },
  {
    name: 'Nano Go Neuronet III',
    effects: [],
  },
  {
    name: 'Nano Go Neuronet IV',
    effects: [],
  },
  {
    name: 'Nano Go Neuronet V',
    effects: [],
  },
  {
    name: 'SVM Multi band Scanner II',
    effects: [],
  },
  {
    name: 'SVM Multi band Scanner III',
    effects: [],
  },
  {
    name: 'SVM Multi band Scanner IV',
    effects: [],
  },
  {
    name: 'SVM Multi band Scanner V',
    effects: [],
  },
  {
    name: 'Plasteel Hull I',
    effects: [battleflyStat('hp', 6, true)],
  },
  {
    name: 'Boosters Thrusters I',
    effects: [battleflyStat('eva', 5)],
  },
  {
    name: 'Ceramo Armor I',
    effects: [],
  },
  {
    name: 'Force Shield: A.T I',
    effects: [],
  },
  {
    name: 'Force Shield: N.X I',
    effects: [battleflyStat('shrg', 2)],
  },
  {
    name: 'Force Shield: Warp I',
    effects: [battleflyStat('shrg', 4)],
  },
  {
    name: 'EMP Ammo I',
    effects: [createElectricModStat('damagePerFire', -5)],
  },
  {
    name: 'Auto Reloaders I',
    effects: [modStat('reload', 10, true)],
  },
  {
    name: 'Combat Algorithms Processor I',
    effects: [battleflyStat('crit', 5)],
  },
  {
    name: 'Regenerative Nanobot I',
    effects: [battleflyStat('hprg', 0.3)],
  },
  {
    name: 'Overclocking Protocols I',
    effects: [createHealthModStat(30, 'damagePerFire', 10), createHealthModStat(30, 'reload', -10)],
  },
  {
    name: 'Rage Against The Nano Machines I',
    effects: [modStat('damagePerFire', 5, true)],
  },
  {
    name: 'Micro Nuclear War Heads II',
    effects: [nuclearDamage(), createDamageType('Nuclear', 12)],
  },
  {
    name: 'Micro Nuclear War Heads III',
    effects: [nuclearDamage(), createDamageType('Nuclear', 18)],
  },
  {
    name: 'Micro Nuclear War Heads IV',
    effects: [nuclearDamage(), createDamageType('Nuclear', 24)],
  },
  {
    name: 'Micro Nuclear War Heads V',
    effects: [nuclearDamage(), createDamageType('Nuclear', 35)],
  },
];
