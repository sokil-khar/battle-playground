import { useParams } from 'react-router-dom';

import { useTrait } from '../../data-layer/useTrait';
import { useUpdateTrait } from '../../data-layer/useUpdateTrait';
import { TraitForm } from '../../forms/Trait';

export const TraitDetailsPage = () => {
  const { traitId } = useParams();
  const [trait, refetchTrait] = useTrait(traitId);
  const updateTrait = useUpdateTrait();

  const onEditTrait = async (trait) => {
    await updateTrait(traitId, trait);

    await refetchTrait();
  };

  if (!trait) return null;
  return (
    <div>
      <TraitForm trait={trait} onSubmit={onEditTrait} mode="edit" />
    </div>
  );
};
