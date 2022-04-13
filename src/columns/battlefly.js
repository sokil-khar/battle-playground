import { percentageFormatter, secondFormatter } from './formatters';

const fields = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'stats.hp',
    headerName: 'HP',
    width: 100,
    valueGetter: (p) => p.row.stats.hp,
    align: 'center',
  },
  {
    field: 'stats.hprg',
    headerName: 'HPRG',
    width: 100,
    valueGetter: (p) => p.row.stats.hprg,
    valueFormatter: secondFormatter,
    align: 'center',
  },
  {
    field: 'stats.arm',
    headerName: 'Armor',
    width: 150,
    valueGetter: (p) => p.row.stats.arm,
    align: 'center',
  },
  {
    field: 'stats.shp',
    headerName: 'SHP',
    width: 150,
    valueGetter: (p) => p.row.stats.shp,
    align: 'center',
  },
  {
    field: 'stats.shrg',
    headerName: 'SHRG',
    width: 150,
    valueGetter: (p) => p.row.stats.shrg,
    valueFormatter: secondFormatter,
    align: 'center',
  },
  {
    field: 'stats.eva',
    headerName: 'EVA',
    width: 150,
    valueGetter: (p) => p.row.stats.eva,
    valueFormatter: percentageFormatter,
    align: 'center',
  },
  {
    field: 'stats.crit',
    headerName: 'CRIT',
    width: 150,
    valueGetter: (p) => p.row.stats.crit,
    valueFormatter: percentageFormatter,
    align: 'center',
  },
];

export default fields;
