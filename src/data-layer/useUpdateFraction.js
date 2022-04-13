import { DB } from './database';

export function useUpdateFraction() {
  const updateFraction = async (fractionId, fraction) => {
    await DB.fractions.update(fractionId, fraction);
  };

  return updateFraction;
}
