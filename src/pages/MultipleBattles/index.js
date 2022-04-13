import { BattlesForm } from '../../forms/Battles';

import { getBattlefly } from '../../data-layer/useBattlefly';
import { generateBattleReport } from '../../battle/battle';
import { useState } from 'react';
import { getMod } from '../../data-layer/useMod';
import { ModType } from '../../data/constants';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

function t(value) {
  return Number(value).toFixed(2);
}

export const MultiBattlesPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const onStartBattles = async (data) => {
    const { battles, count } = data;

    const promises = battles.map(async (battle) => {
      const firstBattlefly = await getBattlefly(battle.firstBattlefly.id);
      const secondBattlefly = await getBattlefly(battle.secondBattlefly.id);

      if (!battle.firstBattleflyModSet || !battle.secondBattleflyModSet) {
        alert('Where is mod for battlefly?');
      }

      const firstBattleflyWeaponSet = (
        await Promise.all(battle.firstBattleflyModSet.mods.map((item) => getMod(item)))
      ).filter((item) => item.type === ModType.Weapon);

      const secondBattleflyModSet = (
        await Promise.all(battle.secondBattleflyModSet.mods.map((item) => getMod(item)))
      ).filter((item) => item.type === ModType.Weapon);

      if (!firstBattleflyWeaponSet.length || !secondBattleflyModSet.length) {
        alert(
          `Sorry, but maybe mod sets "${battle.secondBattleflyModSet.name}" or "${battle.firstBattleflyModSet.name}" don't have weapons`
        );
      }

      firstBattlefly.mods = await Promise.all(
        battle.firstBattleflyModSet.mods.map((item) => getMod(item))
      );
      secondBattlefly.mods = await Promise.all(
        battle.secondBattleflyModSet.mods.map((item) => getMod(item))
      );

      return {
        firstBattlefly,
        secondBattlefly,
      };
    });

    const [sample] = await Promise.all(promises);

    const stat = {
      bfA: null,
      bfB: null,
      wins: {
        winnerA: 0,
        winnerB: 0,
      },
      battles: 0,
      bfAHps: [],
      bfBHps: [],
      durations: [],
    };

    setLoading(true);

    stat.bfA = sample.firstBattlefly;
    stat.bfB = sample.secondBattlefly;

    for (let i = 0; i < count; i++) {
      const [f, s, _, { winner, duration }] = await generateBattleReport(
        sample.firstBattlefly,
        sample.secondBattlefly
      );

      if (winner === f) {
        stat.wins.winnerA++;
      }

      if (winner === s) {
        stat.wins.winnerB++;
      }

      stat.battles++;

      stat.durations.push(duration / 1000);

      stat.bfAHps.push(f.currentStats.hp);

      stat.bfBHps.push(s.currentStats.hp);
    }

    setLoading(false);
    setStats(stat);
  };

  return (
    <div>
      <BattlesForm multiple loading={loading} onSubmit={onStartBattles} />

      <div style={{ height: 50 }} />

      {stats && (
        <div>
          <Typography variant="h6" align="center">
            Report
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    Battles
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {stats.battles}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>{stats.bfA.name}</b> wins
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {stats.wins.winnerA} ({t((stats.wins.winnerA / stats.battles) * 100)}%)
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>{stats.bfB.name}</b> wins
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {stats.wins.winnerB} ({t((stats.wins.winnerB / stats.battles) * 100)}%)
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>{stats.bfA.name}</b> average left HP
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {t(stats.bfAHps.reduce((a, c) => a + c, 0) / stats.bfAHps.length)} HP
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>{stats.bfB.name}</b> average left HP
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {t(stats.bfBHps.reduce((a, c) => a + c, 0) / stats.bfBHps.length)} HP
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>Average duration</b>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {t(stats.durations.reduce((a, c) => a + c, 0) / stats.durations.length)}s
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>Min duration</b>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {Math.min(...stats.durations)}s
                  </TableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <b>Max duration</b>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {Math.max(...stats.durations)}s
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};
