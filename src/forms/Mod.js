import React from 'react';

import { Button, Paper, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { TextInput } from '../components/TextInput';
import { FormErrors } from '../components/FormErrors';

import { SelectInput } from '../components/SelectInput';
import { DamageType, ModType, Rarity } from '../data/constants';

const schema = Yup.object({
  name: Yup.string().required(),
  type: Yup.string().oneOf(Object.keys(ModType)).required(),
  rarity: Yup.string().oneOf(Object.keys(Rarity)).required(),
  data: Yup.object()
    .when('type', {
      is: ModType.Weapon,
      then: (schema) =>
        schema.shape({
          damageType: Yup.string().oneOf(Object.keys(DamageType)).required(),
          reload: Yup.number().moreThan(-1).required(),
          fireRate: Yup.number().moreThan(-1).required(),
          damagePerFire: Yup.number().moreThan(-1).required(),
        }),
      otherwise: (schema) =>
        schema.shape({
          shp: Yup.number().moreThan(-1).required(),
          arm: Yup.number().moreThan(-1).required(),
        }),
    })
    .required(),
}).required();

function getDefaultValues(mod) {
  if (mod) {
    return mod;
  }

  return {
    name: 'Test Name',
    type: ModType.Weapon,
    rarity: Rarity.Common,
    data: {
      damageType: DamageType.Kinetic,
      reload: 0,
      fireRate: 10,
      damagePerFire: 20,
      shp: 0,
      arm: 0,
    },
  };
}

export const ModForm = ({ mod, mode, onSubmit }) => {
  const { control, handleSubmit, formState, watch } = useForm({
    defaultValues: getDefaultValues(mod),
    resolver: yupResolver(schema),
  });

  const watchType = watch('type');

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          {mode === 'edit' ? 'Edit ' : 'Create '}
          Mod
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput name="name" control={control} label="Name" fullWidth />

          <SelectInput label="Rarity" name="rarity" control={control} options={Rarity} fullWidth />

          <SelectInput label="Type" name="type" control={control} options={ModType} fullWidth />

          {watchType === ModType.Weapon ? (
            <WeaponModForm control={control} />
          ) : (
            <SystemModForm control={control} />
          )}

          <FormErrors state={formState} />

          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

function WeaponModForm({ control }) {
  return (
    <React.Fragment>
      <SelectInput
        label="Damage Type"
        name="data.damageType"
        control={control}
        options={DamageType}
        fullWidth
      />

      <TextInput name="data.reload" control={control} label="Reload" fullWidth />

      <TextInput name="data.fireRate" control={control} label="Fire Rate" fullWidth />

      <TextInput name="data.damagePerFire" control={control} label="Damage Per Fire" fullWidth />
    </React.Fragment>
  );
}

function SystemModForm({ control }) {
  return (
    <React.Fragment>
      <TextInput name="data.shp" control={control} label="Shield Points" fullWidth />

      <TextInput name="data.arm" control={control} label="Armor" fullWidth />
    </React.Fragment>
  );
}
