import { useEffect, useState } from 'react';
import { DB } from './database';

async function getFraction(fractionId) {
  const fraction = await DB.fractions.get(fractionId);

  if (fraction.trait) {
    fraction.trait = await DB.traits.get(fraction.trait);
  }

  return fraction;
}

export const useFraction = (fractionId) => {
  const [fraction, setFraction] = useState(null);

  useEffect(() => {
    (async () => {
      setFraction(await getFraction(fractionId));
    })();
  }, [fractionId]);

  const refetchFraction = async () => {
    setFraction(await getFraction(fractionId));
  };

  return [fraction, refetchFraction];
};
