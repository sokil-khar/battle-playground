import React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import fractionColumns from '../../columns/fraction';
import traitColumns from '../../columns/trait';

import { useFractions } from '../../data-layer/useFractions';
import { useTraits } from '../../data-layer/useTraits';

export const FractionsPage = () => {
  const navigate = useNavigate();

  const fractions = useFractions();
  const traits = useTraits();

  const onFractionRowClick = (row) => navigate(`/fractions/${row.id}`);
  const onTraitRowClick = (row) => navigate(`/traits/${row.id}`);

  return (
    <React.Fragment>
      <div style={{ height: 650, marginBottom: 120 }}>
        <Button
          variant="contained"
          style={{ marginBottom: 20 }}
          onClick={() => navigate('/fractions/add')}
        >
          Add Faction
        </Button>

        <DataGrid columns={fractionColumns} rows={fractions} onRowClick={onFractionRowClick} />
      </div>

      <div style={{ height: 650, marginBottom: 120 }}>
        <Button
          variant="contained"
          style={{ marginBottom: 20 }}
          onClick={() => navigate('/traits/add')}
        >
          Add Trait
        </Button>

        <DataGrid columns={traitColumns} rows={traits} onRowClick={onTraitRowClick} />
      </div>
    </React.Fragment>
  );
};
