import { emptyFormatter, decimalFormatter } from './formatters';

const fields = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },

  {
    field: 'damageType',
    headerName: 'Damage Type',
    width: 150,
    valueGetter: (p) => p.row.data.damageType,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'reload',
    headerName: 'Reload',
    width: 150,
    valueGetter: (p) => p.row.data.reload,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'fireRate',
    headerName: 'Fire Rate',
    width: 150,
    valueGetter: (p) => p.row.data.fireRate,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'damagePerFire',
    headerName: 'Damage Per Fire',
    width: 150,
    valueGetter: (p) => p.row.data.damagePerFire,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'damage',
    headerName: 'Damage',
    width: 150,
    valueGetter: (p) => p.row.data.damagePerFire * p.row.data.fireRate,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'damagePerSecond',
    headerName: 'DPS',
    width: 150,
    valueGetter: (p) =>
      decimalFormatter((p.row.data.damagePerFire * p.row.data.fireRate) / p.row.data.reload),
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'shield',
    headerName: 'Shield Points',
    width: 150,
    valueGetter: (p) => p.row.data.shp,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'armor',
    headerName: 'Armor',
    width: 150,
    valueGetter: (p) => p.row.data.arm,
    valueFormatter: emptyFormatter,
    headerAlign: 'center',
    align: 'center',
  },
];

export default fields;
