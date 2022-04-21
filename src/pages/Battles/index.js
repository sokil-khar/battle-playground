import { BattlesForm } from '../../forms/Battles';

import { getBattlefly } from '../../data-layer/useBattlefly';
import { generateBattleReport } from '../../battle/battle';
import { useState } from 'react';
import { getMod } from '../../data-layer/useMod';
import { ModType } from '../../data/constants';
import { BattleReports } from '../../forms/BattleReports';
import { Button, Typography } from '@mui/material';

export async function prepareBattlefliesToBattle(battleflies) {
  const result = [];

  for(const battlefly of battleflies) {
    const data = await getBattlefly(battlefly.id);

    const defaultModSet = battlefly.modSets[0];
    data.mods = await Promise.all(
      defaultModSet.mods.map((item) => getMod(item))
    );

    result.push(data);
  }

  return result;
}


export const BattlesPage = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(0);

  const onStartBattles = async (data) => {
    const { battles } = data;

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

    const battleSamples = await Promise.all(promises);

    const reports = [];

    setActiveReport(0);

    for (const sample of battleSamples) {
      const reportData = await generateBattleReport(sample.firstBattlefly, sample.secondBattlefly);

      reports.push({
        battleflyA: sample.firstBattlefly,
        battleflyB: sample.secondBattlefly,
        data: reportData,
      });
    }

    setReports(reports);
  };

  const onChangeReport = (step) => {
    return () => {
      const newValue = step + activeReport;

      const value = Math.max(0, Math.min(newValue, reports.length - 1));
      setActiveReport(value);
    };
  };

  return (
    <div>
      <BattlesForm onSubmit={onStartBattles} />

      <div style={{ height: 50 }} />

      {reports.length > 0 && (
        <div>
          <Typography variant="h6" align="center">
            Report {activeReport + 1} / {reports.length}
          </Typography>
        </div>
      )}

      {reports.length > 0 && <div style={{ height: 50 }} />}

      {reports.length > 0 && <BattleReports report={reports[activeReport]} />}

      {reports.length > 0 && <div style={{ height: 50 }} />}

      {reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onClick={onChangeReport(-1)} disabled={activeReport === 0}>
            Prev Report
          </Button>

          <Button onClick={onChangeReport(1)} disabled={activeReport === reports.length - 1}>
            Next Report
          </Button>
        </div>
      )}
    </div>
  );
};
