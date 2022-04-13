import { useEffect, useState } from 'react';
import { DB } from './database';



export const useMods = () => {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    (async () => {
      const mods = await DB.mods.toArray();

      setMods(mods);
    })();
  }, []);

  return mods;
};
