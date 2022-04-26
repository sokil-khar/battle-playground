import { Button, Paper, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { TextInput } from '../components/TextInput';
import { SelectInput } from '../components/SelectInput';

import { FormErrors } from '../components/FormErrors';
import { StatsData, Rarity } from '../data/constants';

import { useFractions } from '../data-layer/useFractions';

const schema = Yup.object({
  name: Yup.string().required(),
  rarity: Yup.string().oneOf(Object.keys(Rarity)).required(),
  fraction: Yup.string(),
  level: Yup.number().required(),
  stats: Yup.object({
    hp: Yup.number().moreThan(-1).required(),
    hprg: Yup.number().moreThan(-1).required(),
    arm: Yup.number().moreThan(-1).required(),
    shp: Yup.number().moreThan(-1).required(),
    shrg: Yup.number().moreThan(-1).required(),
    eva: Yup.number().moreThan(-1).required(),
    crit: Yup.number().moreThan(-1).required(),
    xpr: Yup.number().moreThan(-1).required(),
    loot: Yup.number().moreThan(-1).required(),
    dcrit: Yup.number().moreThan(-1).required(),
    rcrit: Yup.number().moreThan(-1).required(),
  }).required(),
}).required();

function getDefaultValues(battlefly) {
  if (battlefly) {
    return {
      ...battlefly,
      modSets:
        battlefly.modSets?.map((item) => ({
          name: item.name,
          mods: (modSet) => modSet.map((item) => item.id),
        })) || [],
      traits: battlefly.traits?.map((trait) => trait.id) || [],
      fraction: battlefly.fraction?.id,
    };
  }

  return {
    name: 'Test Name',
    rarity: 'Common',
    fraction: '1',
    level: 1,
    stats: Object.entries(StatsData).reduce(
      (a, [key, value]) => ({ ...a, [key]: value.default }),
      {}
    ),
    weaponbonus: {
      Kinetic: 0,
      Energy: 0,
      Missile: 0,
      Electric: 0,
      Nuclear: 0
    },
    characteristics: {
      sensorsArray: 0,
      fusionBattery: 0,
      nanoFrame: 0,
      engines: 0,
      cpu: 0,
    },
  };
}

export const BattleflyForm = ({ battlefly, mode, onSubmit }) => {
  const fractions = useFractions();

  const { control, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(battlefly),
    resolver: yupResolver(schema),
  });

  const fractionOptions = fractions.reduce(
    (a, c) => ({
      ...a,
      [c.id]: c.name,
    }),
    {}
  );
  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          {mode === 'edit' ? 'Edit ' : 'Create '}
          Battlefly
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput name="name" control={control} label="Name" fullWidth />

          <SelectInput label="Rarity" name="rarity" control={control} options={Rarity} fullWidth />

          <TextInput name="level" control={control} label="Level" fullWidth />

          <TextInput name="stats.hp" control={control} label="Hit Points" fullWidth />

          <TextInput name="stats.hprg" control={control} label="Hit Point Regen (%/s)" fullWidth />

          <TextInput name="stats.arm" control={control} label="Armor" fullWidth />

          <TextInput name="stats.shp" control={control} label="Shield Points" fullWidth />

          <TextInput
            name="stats.shrg"
            control={control}
            label="Shield Points Regen (%/s)"
            fullWidth
          />

          <TextInput name="stats.eva" control={control} label="Evasion (%)" fullWidth />

          <TextInput name="stats.crit" control={control} label="Critical chance (%)" fullWidth />
          <TextInput name="stats.bat" control={control} label="Battery" fullWidth />
          <TextInput name="stats.xpr" control={control} label="XP Rate (%)" fullWidth />
          <TextInput name="stats.loot" control={control} label="Mod Loot Chance (%)" fullWidth />
          <TextInput name="stats.dcrit" control={control} label="Critical Damage (%)" fullWidth />

          <TextInput name="stats.rcrit" control={control} label="Critical Resist (%)" fullWidth />

          <FormErrors state={formState} />

          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};
