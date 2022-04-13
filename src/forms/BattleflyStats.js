import { Typography, List, ListItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ModType, StatsData } from '../data/constants';
import { traitFormatter } from '../columns/formatters';
import { useForm } from 'react-hook-form';

import { SelectInput } from '../components/SelectInput';
import { getBattleflyStats, getBattleflyStatsEffects } from '../battle/battlefly';
import { EffectType } from '../battle/constants';

function getModShortData(mod) {
  if (mod.type === ModType.Weapon) {
    return (
      mod.name +
      ` (${mod.rarity}/${mod.data.damageType}/R: ${mod.data.reload}, FR: ${mod.data.fireRate}, DPF: ${mod.data.damagePerFire})`
    );
  }

  return mod.name + ` (${mod.rarity}/SHP: ${mod.data.shp}, ARM: ${mod.data.arm})`;
}

function groupBy(items, by) {
  return items.reduce((acc, item) => {
    const key = item[by];
    acc[key] = acc[key] ? acc[key].concat(item) : [item];

    return acc;
  }, {});
}

export const BattleflyStats = ({ battlefly, modSets = [] }) => {
  const { watch, control } = useForm({
    defaultValues: {
      modSet: '0',
    },
  });

  // TODO: change it
  const modSetOptions = modSets.reduce(
    (a, c, idx) => ({
      ...a,
      [idx]: c.name,
    }),
    {}
  );

  const activeModSet = watch('modSet');

  const stateUpdates = groupBy(
    getBattleflyStatsEffects(battlefly, modSets[activeModSet]?.mods || [])
      .filter((effect) => effect.type === EffectType.Stat)
      .map((item) => item.data),
    'stat'
  );
  const actualStats = getBattleflyStats(battlefly, modSets[activeModSet]?.mods || []).stats;

  return (
    <div>
      <Typography paragraph variant="h5">
        Actual Stats
      </Typography>

      <form>
        <SelectInput
          label="Active Mod Set"
          control={control}
          name="modSet"
          options={modSetOptions}
          fullWidth
        />

        {Object.entries(StatsData).map(([key, value]) => (
          <Accordion key={key}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {value.name}: {t(actualStats[key])}
                {StatsData[key].sign}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  1. Initial value for stat:
                  <b style={{ marginLeft: 10 }}>
                    {battlefly.stats[key]}
                    {StatsData[key].sign}
                  </b>
                </ListItem>
                {stateUpdates[key]
                  ?.filter((i) => i?.change)
                  .map((item, idx) => (
                    <ListItem>
                      {idx + 2}.{' '}
                      <StatUpdateInfo item={item} battlefly={battlefly} actualStats={actualStats} />
                    </ListItem>
                  ))}
                <ListItem style={{ marginTop: 20 }}>
                  Together:{' '}
                  <StatUpdatesInfo stat={key} items={stateUpdates[key]} battlefly={battlefly} />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </form>
    </div>
  );
};

function t(value) {
  return Number(value).toFixed(2);
}

function getCharacteristic(key) {
  const obj = {
    sensorsArray: 'Sensors Array',
    fusionBattery: 'Fusion Battery',
    nanoFrame: 'Nano Frame',
    engines: 'Engines',
    cpu: 'CPU',
  };

  return obj[key];
}

function StatUpdatesInfo({ stat, items, battlefly }) {
  const { stats } = battlefly;
  let value = stats[stat];
  const sign = StatsData[stat].sign;
  let result = `${value} ${sign}`;

  if (!items) return result;

  for (const item of items) {
    if (item.change === 0) continue;

    result += ` ${item.change > 0 ? '+' : '-'} ${t(item.change)} ${sign}`;

    value += item.change;
  }

  return result + ` = ${t(value)} ${sign} (Actual value)`;
}

function StatUpdateInfo({ item, battlefly, actualStats }) {
  const { stat, change } = item;
  const { reason, data } = item.reason;
  const { stats } = battlefly;

  if (change === 0) return null;

  const v = stats[stat] + change;

  let result = `${stats[stat]} ${StatsData[stat].sign} ${change > 0 ? '+' : '-'} ${t(change)} ${
    StatsData[stat].sign
  } = ${t(v)} ${StatsData[stat].sign}`;

  if (reason === 'Trait') {
    result += ` (Trait: ${traitFormatter(data.trait)})`;
  }

  if (reason === 'MagicValue') {
    result += ` (Magic Stat: +${actualStats.mag}%)`;
  }

  if (reason === 'Mod') {
    result += ` (Mod ${getModShortData(data.mod)})`;
  }

  if (reason === 'ModEffect') {
    result += ` (ModEffect ${data.effect.type})`;
  }

  if (reason === 'Characteristic') {
    result += ` (Characteristic "${getCharacteristic(data.characteristic)}")`;
  }

  return result;
}
