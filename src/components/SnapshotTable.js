import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getBattleflyPowerRating, getBattleflyStars } from '../data/constants';

import { Stars } from '../components/Stars';

function Comparasion({ bfA, bfB, stat, sign = '' }) {
  const firstClassName = bfA.originalStats[stat] > bfB.originalStats[stat] ? 'winner' : '';
  const secondClassName = bfB.originalStats[stat] > bfA.originalStats[stat] ? 'winner' : '';

  return (
    <React.Fragment>
      <TableCell align="right">
        <span className={firstClassName}>
          {bfA.originalStats[stat].toFixed(2)}
          {sign}
        </span>
      </TableCell>
      <TableCell align="right">
        <span className={secondClassName}>
          {bfB.originalStats[stat].toFixed(2)}
          {sign}
        </span>
      </TableCell>
    </React.Fragment>
  );
}

function BaseComparasion({ v1, v2, sign = '' }) {
  const firstClassName = v1 > v2 ? 'winner' : '';
  const secondClassName = v2 > v1 ? 'winner' : '';

  return (
    <React.Fragment>
      <TableCell align="right">
        <span className={firstClassName}>
          {v1.toFixed(2)}
          {sign}
        </span>
      </TableCell>
      <TableCell align="right">
        <span className={secondClassName}>
          {v2.toFixed(2)}
          {sign}
        </span>
      </TableCell>
    </React.Fragment>
  );
}

export function SnapshotTable({ battleflyA, battleflyB }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stats</TableCell>
            <TableCell align="right">{battleflyA.getName()}</TableCell>
            <TableCell align="right">{battleflyB.getName()}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Power Rating
            </TableCell>
            <BaseComparasion
              v1={getBattleflyPowerRating(battleflyA, battleflyA.mods)}
              v2={getBattleflyPowerRating(battleflyB, battleflyB.mods)}
            />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell align="right">
              <Stars
                count={getBattleflyStars(getBattleflyPowerRating(battleflyA, battleflyA.mods))}
              />
            </TableCell>
            <TableCell align="right">
              <Stars
                count={getBattleflyStars(getBattleflyPowerRating(battleflyB, battleflyB.mods))}
              />
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Left HP
            </TableCell>
            <BaseComparasion v1={battleflyA.currentStats.hp} v2={battleflyB.currentStats.hp} />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              HP
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="hp" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              ARM
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="arm" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              SHP
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="shp" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              HPRG
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="hprg" sign=" %/s" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              SHRG
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="shrg" sign=" %/s" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              EVA
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="eva" sign=" %" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              CRIT
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="crit" sign=" %" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              DCRIT
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="dcrit" sign=" %" />
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              RCRIT
            </TableCell>
            <Comparasion bfA={battleflyA} bfB={battleflyB} stat="rcrit" sign=" %" />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
