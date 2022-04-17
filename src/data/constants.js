import rarities from './rarities.json';

export const ModType = {
  Weapon: 'Weapon',
  Defense: 'Defense',
  Utility: 'Utility',
};

export const DamageType = {
  Kinetic: 'Kinetic',
  Energy: 'Energy',
  Missile: 'Missile',
  Electric: 'Electric',
  Nuclear: 'Nuclear',
};

export const Rarity = rarities.reduce((a, c) => ({ ...a, [c]: c }), {});

export const StatsData = {
  hp: {
    name: 'Hit Point',
    abbr: 'HP',
    default: 300,
    sign: '',
    min: 0,
    max: true,
  },
  hprg: {
    name: 'Hit Point Regen',
    abbr: 'HPRG',
    sign: '%/s',
    default: 0,
    min: 0,
  },
  arm: {
    name: 'Armor',
    abbr: 'ARM',
    default: 0,
    sign: '',

    min: 0,
  },
  shp: {
    name: 'Shield Points',
    abbr: 'SHP',
    default: 0,
    sign: '',
    min: 0,
    max: true,
  },
  shrg: {
    name: 'Shield Regen',
    abbr: 'SHRG',
    sign: '%/s',
    default: 0,
    min: 0,
  },
  eva: {
    name: 'Evasion',
    abbr: 'EVA',
    sign: '%',
    default: 1,
    min: 0,
  },
  crit: {
    name: 'Critical chance',
    abbr: 'CRIT',
    sign: '%',
    default: 1,
    min: 0,
  },
  sup: {
    name: 'Self Update Protocols',
    abbr: 'SUP',
    sign: '%',
    default: 0,
    min: 0,
  },
  scv: {
    name: 'Scavenge',
    abbr: 'SCV',
    sign: '%',
    default: 0,
    min: 0,
  },
  dcrit: {
    name: 'Critical Damage',
    abbr: 'DCRIT',
    sign: '%',
    default: 150,
    min: 0,
  },
  rcrit: {
    name: 'Critical Resist',
    abbr: 'RCRIT',
    sign: '%',
    default: 0,
    min: 0,
  }
};

const LevelIndex = {
  4: 1,
  8: 2,
  12: 3,
  16: 4,
  20: 5,
};

const StarIndex = {
  200: 1,
  400: 2,
  600: 3,
  800: 4,
  1000: 5,
};

const RarityIndex = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

function getLevelIndex(level) {
  const idx = Object.keys(LevelIndex).findIndex((item) => level <= item);

  return idx > 0
    ? LevelIndex[Object.keys(LevelIndex)[idx]]
    : LevelIndex[Object.keys(LevelIndex)[0]];
}

function getRarityIndex(rarity) {
  return RarityIndex[rarity] || 0;
}

export const getBattleflyPowerRating = (battlefly, mods = []) => {
  const weapons = mods
    .filter((mod) => mod.isWeapon())
    .slice(0, 2)
    .map((mod) => mod.getRarity());
  const utilities = mods
    .filter((mod) => !mod.isWeapon())
    .slice(0, 2)
    .map((mod) => mod.getRarity());

  return (
    weapons.reduce((a, c) => a + getRarityIndex(c) * 50, 0) +
    utilities.reduce((a, c) => a + getRarityIndex(c) * 20, 0) +
    getRarityIndex(battlefly.getRarity()) * 30 +
    getLevelIndex(battlefly.getLevel()) * 30
  );
};

export function getNormalRating(battlefly, mods = []) {
  const level = getLevelIndex(battlefly.level) * 30;
  const rarity = getRarityIndex(battlefly.rarity) * 30;

  const weapons = mods.filter(mod => mod.type === 'Weapon').slice(0, 2).reduce((a, c) => a + getRarityIndex(c.rarity) * 50, 0);
  const utilities = mods.filter(mod => mod.type !== 'Weapon').slice(0, 2).reduce((a, c) => a + getRarityIndex(c.rarity) * 20, 0);

  return level + rarity + weapons + utilities;
}

export function getBattleflyStars(rating) {
  const idx = Object.keys(StarIndex).findIndex((item) => rating <= item);

  return idx > 0 ? StarIndex[Object.keys(StarIndex)[idx]] : StarIndex[Object.keys(StarIndex)[0]];
}
