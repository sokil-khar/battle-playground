import { Dexie } from 'dexie';

export const DB = new Dexie('BattleflyDatabase');

DB.version(3).stores({
  battleflies: '++id, name, level, rarity, fraction, stats, modSets, characteristics, traits',
  mods: '++id, name, rarity, type, data', // +
  metadata: '++key, value', // +
  fractions: '++id, name, trait', // +
  traits: '++id, action, data', // +
});

export const BackupDB = new Dexie('BattleflyBackupDatabase');

BackupDB.version(1).stores({
  battleflies: '++id, data',
});
