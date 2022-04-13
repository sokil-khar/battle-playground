import { traitFormatter } from './formatters';

const fields = [
  {
    field: 'effect',
    headerName: 'Effect',
    valueGetter: (p) => p.row,
    valueFormatter: (params) => {
      return traitFormatter(params.value);
    },
    flex: 1,
  },
];

export default fields;
