import { useNavigate } from 'react-router-dom';

import { useAddBattlefly } from '../../data-layer/useAddBattlefly';
import { BattleflyForm } from '../../forms/Battlefly';

export const AddBattleflyPage = () => {
  const navigate = useNavigate();
  const addBattlefly = useAddBattlefly();

  const onSubmit = async (data) => {
    const battlefly = await addBattlefly(data);

    navigate(`/battleflies/${battlefly.id}`);
  };

  return (
    <div>
      <BattleflyForm onSubmit={onSubmit} />
    </div>
  );
};
