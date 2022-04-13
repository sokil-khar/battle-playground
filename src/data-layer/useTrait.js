import { useEffect, useState } from 'react';
import { DB } from './database';

async function getTrait(traitId) {
  return DB.traits.get(traitId);
}

export const useTrait = (traitId) => {
  const [trait, setTrait] = useState(null);

  useEffect(() => {
    (async () => {
      setTrait(await getTrait(traitId));
    })();
  }, [traitId]);

  const refetchTrait = async () => {
    setTrait(await getTrait(traitId));
  };

  return [trait, refetchTrait];
};
