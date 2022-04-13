import { useNavigate } from 'react-router-dom';
import { useAddMod } from '../../data-layer/useAddMod';

import { ModForm } from '../../forms/Mod';

export const AddModPage = () => {
  const navigate = useNavigate();
  const addMod = useAddMod();

  const onAddMod = async (data) => {
    const mod = await addMod(data);

    navigate(`/mods/${mod.id}`);
  };

  return (
    <div>
      <ModForm onSubmit={onAddMod} />
    </div>
  );
};
