import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';

import { TextInput } from '../components/TextInput';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object({
  sensorsArray: Yup.number().required(),
  fusionBattery: Yup.number().required(),
  nanoFrame: Yup.number().required(),
  engines: Yup.number().required(),
  cpu: Yup.number().required(),
}).required();

function getDefaultValues(characteristics) {
  if (!characteristics) {
    return {
      sensorsArray: 0,
      fusionBattery: 0,
      nanoFrame: 0,
      engines: 0,
      cpu: 0,
    };
  }

  return characteristics;
}

export const BattleflyCharacteristicsForm = ({ battlefly, onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: getDefaultValues(battlefly.characteristics),
    resolver: yupResolver(schema),
  });

  return (
    <div>
      <Typography paragraph variant="h5">
        Characteristics
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput name="sensorsArray" control={control} label="Sensors Array" fullWidth />

        <TextInput name="fusionBattery" control={control} label="Fusion Battery" fullWidth />

        <TextInput name="nanoFrame" control={control} label="Nano Frame" fullWidth />

        <TextInput name="engines" control={control} label="Engines" fullWidth />

        <TextInput name="cpu" control={control} label="CPU" fullWidth />

        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </div>
  );
};
