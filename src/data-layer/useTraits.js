import { useEffect, useState } from 'react';
import { DB } from './database';

export const useTraits = () => {
  const [traits, setTraits] = useState([]);

  useEffect(() => {
    (async () => {
      const traits = await DB.traits.toArray();

      setTraits(traits);
    })();
  }, []);

  return traits;
};
