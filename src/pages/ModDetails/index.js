import { useParams } from 'react-router-dom';

import { useMod } from '../../data-layer/useMod';
import { useUpdateMod } from '../../data-layer/useUpdateMod';
import { useUpdateModEffects } from '../../data-layer/useUpdateEffects';

import { ModForm } from '../../forms/Mod';
import { ModEffectsForm } from '../../forms/ModEffects';

export const ModDetailsPage = () => {
  const { modId } = useParams();
  const [mod, refetchMod] = useMod(modId);
  const updateMod = useUpdateMod();
  const updateModEffects = useUpdateModEffects();

  const onEditMod = async (mod) => {
    await updateMod(modId, mod);

    await refetchMod();
  };

  const onUpdateEffects = async (effects) => {
    updateModEffects(modId, effects);

    await refetchMod();
  };

  if (!mod) return null;
  return (
    <div>
      <ModForm mod={mod} onSubmit={onEditMod} mode="edit" />

      <div style={{ height: 30 }} />

      <ModEffectsForm items={mod.effects || []} onSubmit={onUpdateEffects} />
    </div>
  );
};
