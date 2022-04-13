import { useParams } from 'react-router-dom';

import { useFraction } from '../../data-layer/useFraction';
import { useUpdateFraction } from '../../data-layer/useUpdateFraction';
import { FractionForm } from '../../forms/Fraction';

export const FractionDetailsPage = () => {
  const { fractionId } = useParams();

  const [fraction, refetchFraction] = useFraction(fractionId);
  const updateFraction = useUpdateFraction();

  if (!fraction) return null;

  const onEditFraction = async (fraction) => {
    await updateFraction(fractionId, fraction);

    await refetchFraction();
  };

  return (
    <div>
      <FractionForm fraction={fraction} onSubmit={onEditFraction} mode="edit" />
    </div>
  );
};
