import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { useMods } from '../../data-layer/useMods';
import modColumns from '../../columns/mod';
import { Button } from '@mui/material';

export const ModsPage = () => {
  const mods = useMods();
  const navigate = useNavigate();

  const onRowClick = (row) => navigate(`/mods/${row.id}`);

  return (
    <div style={{ height: 600 }}>
      <Button
        variant="contained"
        style={{ marginBottom: 20 }}
        onClick={() => navigate('/mods/add')}
      >
        Add Mod
      </Button>

      <DataGrid
        components={{ Toolbar: GridToolbar }}
        columns={modColumns}
        rows={mods}
        onRowClick={onRowClick}
      />
    </div>
  );
};
