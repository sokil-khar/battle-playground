import { useNavigate } from 'react-router-dom';
import { useAddFraction } from '../../data-layer/useAddFraction.js';

import { FractionForm } from '../../forms/Fraction';

export const AddFractionPage = () => {
  const navigate = useNavigate();
  const addFraction = useAddFraction();

  const onAddFraction = async (data) => {
    const fraction = await addFraction(data);

    navigate(`/fractions/${fraction.id}`);
  };

  return (
    <div>
      <FractionForm onSubmit={onAddFraction} />
    </div>
  );
};
