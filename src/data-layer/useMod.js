import { useEffect, useState } from 'react';
import { DB } from './database';

export async function getMod(modId) {
  return DB.mods.get(modId);
}

export const useMod = (modId) => {
  const [mod, setMod] = useState(null);

  useEffect(() => {
    (async () => {
      setMod(await getMod(modId));
    })();
  }, [modId]);

  const refetchMod = async () => {
    setMod(await getMod(modId));
  };

  return [mod, refetchMod];
};
