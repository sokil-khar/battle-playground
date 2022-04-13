import { useEffect, useState } from 'react';
import { DB } from './database';

export const useFractions = () => {
  const [fractions, setFractions] = useState([]);

  useEffect(() => {
    (async () => {
      const fractions = await DB.fractions.toArray();

      await Promise.all(
        fractions.map(async (fraction) => {
          if (!fraction.trait) return fraction;
          fraction.trait = await DB.traits.get(fraction.trait);

          return fraction;
        })
      );

      setFractions(fractions);
    })();
  }, []);

  return fractions;
};
