import { traitFormatter } from './formatters';

const fields = [
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
  },
  {
    field: 'trait',
    headerName: 'Trait',
    valueGetter: (p) => p.row.trait,
    valueFormatter: (params) => {
      return traitFormatter(params.value);
    },
    width: 300,
  },
];

export default fields;
