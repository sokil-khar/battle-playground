import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { useBattleflies } from '../../data-layer/useBattleflies';
import battleflyColumns from '../../columns/battlefly';
import { Button } from '@mui/material';
import { useSaveBattleflies } from '../../data-layer/useSaveBattleflies';

export const BattlefliesPage = () => {
  const battleflies = useBattleflies();
  const navigate = useNavigate();

  const [saveBattleflies, restoreBattleflies] = useSaveBattleflies();

  const onRowClick = (row) => navigate(`/battleflies/${row.id}`);

  const onBattleflySave = async () => {
    await saveBattleflies();

    alert('Saved');
  };

  const onBattleflyRestore = async () => {
    await restoreBattleflies();

    window.location.reload();
  };

  return (
    <div style={{ height: 600 }}>
      <Button
        variant="contained"
        style={{ marginBottom: 20 }}
        onClick={() => navigate('/battleflies/add')}
      >
        Add Battlefly
      </Button>

      <Button
        variant="contained"
        style={{ marginLeft: 20, marginBottom: 20 }}
        onClick={onBattleflySave}
      >
        Save Battleflies
      </Button>

      <Button
        variant="contained"
        style={{ marginLeft: 20, marginBottom: 20 }}
        onClick={onBattleflyRestore}
      >
        Load Battleflies
      </Button>

      <DataGrid
        components={{ Toolbar: GridToolbar }}
        columns={battleflyColumns}
        rows={battleflies}
        onRowClick={onRowClick}
      />
    </div>
  );
};
