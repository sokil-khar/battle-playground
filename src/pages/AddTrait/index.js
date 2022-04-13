import { useNavigate } from 'react-router-dom';
import { useAddTrait } from '../../data-layer/useAddTrait.js';

import { TraitForm } from '../../forms/Trait';

export const AddTraitPage = () => {
  const navigate = useNavigate();
  const addTrait = useAddTrait();

  const onAddTrait = async (data) => {
    const trait = await addTrait(data);

    navigate(`/traits/${trait.id}`);
  };

  return (
    <div>
      <TraitForm onSubmit={onAddTrait} />
    </div>
  );
};
