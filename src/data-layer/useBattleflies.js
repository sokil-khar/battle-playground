import { useEffect, useState } from 'react';
import { DB } from './database';

export const useBattleflies = () => {
  const [battleflies, setBattleflies] = useState([]);

  useEffect(() => {
    (async () => {
      const battleflies = await DB.battleflies.toArray();

      setBattleflies(battleflies);
    })();
  }, []);

  return battleflies;
};
