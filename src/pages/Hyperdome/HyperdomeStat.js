import { Autocomplete, List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import duration from 'humanize-duration';
import React from "react";
import { useForm } from "react-hook-form";
import { BattleflySnapshot } from "../../battle/core/battlefly";
import { Section } from "../../components/Section";
import { Stars } from "../../components/Stars";
import { getBattleflyPowerRating, getBattleflyStars } from "../../data/constants";
import { Link } from 'react-router-dom'

function CommonTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stat</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Battles Count
            </TableCell>
            <TableCell component="th" scope="row">
              {data.stats.battlesCount}
            </TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Emulated Time
            </TableCell>
            <TableCell component="th" scope="row">
              {duration(data.totalTime)}
            </TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Real Emulated Time
            </TableCell>
            <TableCell component="th" scope="row">
              {duration(data.time, { delimiter: ' - ' })}
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Time between battles
            </TableCell>
            <TableCell component="th" scope="row">
              {duration(data.timeBetweenBattles)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function getStats(items) {
  const minDuration = Math.min(...items);
  const maxDuration = Math.max(...items);

  const sumDuration = items.reduce((a, c) => a + c, 0);

  return [minDuration, maxDuration, (sumDuration / items.length).toFixed(3)];
}

function getPercentage(value, total) {
  return ((value / total) * 100).toFixed(2) + '%';
}

function RankingTable({ data }) {
  const battleflies = Object.entries(data.stats.battleflies).sort((a, b) => {
    const diff =  b[1].wins - a[1].wins;

    if(diff !== 0) return diff;
    return a[1].loses - b[1].loses;
  }).map(item => {
    return {
      ...item[1],
      duration: getStats(item[1].duration),
      hp: getStats(item[1].hp),
      battlefly: data.battleflies.find(b => b.id === item[0]),
      snapshot: new BattleflySnapshot(data.battleflies.find(b => b.id === item[0]))
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Battlefly</TableCell>
            <TableCell>Wins</TableCell>
            <TableCell>Loses</TableCell>
            <TableCell>Battles</TableCell>
            <TableCell>Min Duration</TableCell>
            <TableCell>Max Duration</TableCell>
            <TableCell>Average Duration</TableCell>
            <TableCell>Min HP</TableCell>
            <TableCell>Max HP</TableCell>
            <TableCell>Average HP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {battleflies.map((item, i) =>
            <TableRow sx={{ backgroundColor: `${i < 10 ? '#ddffcc' : (i >= 95) ? '#ff8566' : 'white'}`, '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {i + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {i === 0 && '🥇 '}
                {i === 1 && '🥈 '}
                {i === 2 && '🥉 '}
                <Link style={{ textDecoration: 'none' }} to={`/battleflies/${item.battlefly.id}`}>{item.battlefly.name + ' '}</Link>
                <Stars
                  count={getBattleflyStars(getBattleflyPowerRating(item.snapshot, item.snapshot.getMods()))}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <b class="highlight-green">{item.wins}</b> ({getPercentage(item.wins, data.stats.battlesCount)})
              </TableCell>
              <TableCell component="th" scope="row">
                <b class="highlight-red">{item.loses}</b> ({getPercentage(item.loses, data.stats.battlesCount)})
              </TableCell>
              <TableCell component="th" scope="row">
                <b class="highlight-black">{item.wins + item.loses}</b> ({getPercentage(item.wins + item.loses, data.stats.battlesCount)})
              </TableCell>
              <TableCell component="th" scope="row">
                {duration(item.duration[0], { delimiter: ' and ' })}
              </TableCell>
              <TableCell component="th" scope="row">
                {duration(item.duration[1], { delimiter: ' and ' })}
              </TableCell>
              <TableCell component="th" scope="row">
                {duration(item.duration[2], { delimiter: ' and ', maxDecimalPoints: 2 })}
              </TableCell>
              <TableCell component="th" scope="row">
                {parseFloat((item.hp[0])).toFixed(2)} HP
              </TableCell>
              <TableCell component="th" scope="row">
                {parseFloat((item.hp[1])).toFixed(2)} HP
              </TableCell>
              <TableCell component="th" scope="row">
                {parseFloat((item.hp[2])).toFixed(2)} HP
              </TableCell>
            </TableRow>)
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BattleflyBattle({ battle, number, battleflies }) {
  const battleflyA = battleflies.find(b => b.getId() === battle.battleflyA);
  const battleflyB = battleflies.find(b => b.getId() === battle.battleflyB);

  const winner = battle.winner === battleflyA.getId() ? battleflyA : battleflyB;

  const classNameA = winner === battleflyA ? 'highlight-green' : 'highlight-red';
  const classNameB = winner === battleflyB ? 'highlight-green' : 'highlight-red';

  const starA = <Stars count={getBattleflyStars(getBattleflyPowerRating(battleflyA, battleflyA.getMods()))} />
  const starB = <Stars count={getBattleflyStars(getBattleflyPowerRating(battleflyB, battleflyB.getMods()))} />

  return (
    <Section>
      <h2>[{duration(battle.time)}] Battle #{number}</h2>
      <p><span className={classNameA}>{battleflyA.getName()} {starA}</span> vs. <span className={classNameB}>{battleflyB.getName()} {starB}</span></p>

      <p>Duration: <b>{duration(battle.duration)}</b></p>
      <p className={classNameA}>{battleflyA.getName()} left HP: <b>{parseFloat(battle.battleflyALeftHP).toFixed(2)} HP</b></p>
      <p className={classNameB}>{battleflyB.getName()} left HP: <b>{parseFloat(battle.battleflyBLeftHP).toFixed(2)} HP</b></p>
    </Section>
  );
}

function Battles({ data }) {
  const { setValue, watch } = useForm({
    defaultValues: {
      selected: []
    }
  })
  const selected = watch('selected');

  const battleflies = Object.entries(data.stats.battleflies).sort((a, b) => b[1].wins - a[1].wins).map(item => {
    return new BattleflySnapshot(data.battleflies.find(b => b.id === item[0]))
  });

  const showedBattles = selected.find(item => item.id === null) ? data.stats.battles : data.stats.battles.filter(battle => selected.find(item => item.id === battle.battleflyA || item.id === battle.battleflyB));

  return (
    <Section>
      <Autocomplete
        disablePortal
        options={data.battleflies.concat({ id: null, name: 'All' })}
        renderInput={(params) => <TextField {...params} label="Show battles for: (type 'All' to show all battles)" fullWidth />}
        value={selected}
        onChange={(_, value) => {
          setValue(`selected`, value);
        }}
        getOptionLabel={(item) => item.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        fullWidth
        multiple
      />

      <List>
        {showedBattles.map((battle) =>
          <React.Fragment key={battle.id}>
            <BattleflyBattle number={battle.id} battle={battle} battleflies={battleflies} />
            <div style={{  height: 30 }}/>
          </React.Fragment>
        )}
      </List>
    </Section>
  )
}

export const HyperdomeStat = ({ data }) => {
  return <div>
    <CommonTable data={data} />
    <div style={{ height: 50 }} />
    <RankingTable data={data} />
    <div style={{ height: 50 }} />
    <Battles data={data} />
  </div>;
}
