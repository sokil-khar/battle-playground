import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function SnapshotModsTable({ fB, sB }) {
  const weapons = fB
    .getMods()
    .filter((item) => item.isWeapon())
    .concat(sB.getMods().filter((item) => item.isWeapon()));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Mod</TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">
                {weapon.getName()} {'(' + weapon.owner.getName() + ')'}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Reload
            </TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">{weapon.originalStats.reload.toFixed(2)}</TableCell>
            ))}
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Damage Per Fire
            </TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">{weapon.originalStats.damagePerFire.toFixed(2)}</TableCell>
            ))}
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Fire Rate
            </TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">{weapon.originalStats.fireRate}</TableCell>
            ))}
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Damage
            </TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">
                {(weapon.originalStats.damagePerFire * weapon.originalStats.fireRate).toFixed(2)}
              </TableCell>
            ))}
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              DMS
            </TableCell>
            {weapons.map((weapon) => (
              <TableCell align="right">
                {(
                  (weapon.originalStats.damagePerFire * weapon.originalStats.fireRate) /
                  weapon.originalStats.reload
                ).toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
