import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useMods } from '../data-layer/useMods';
import { FormErrors } from '../components/FormErrors';
import { TextInput } from '../components/TextInput';

const schema = Yup.object({
  name: Yup.string().required(),
  mods: Yup.array().required(),
}).required();

function getDefaultValues(data) {
  if (data === true) {
    return {
      name: '',
      mods: [],
    };
  }

  return {
    name: data.name,
    mods: data.mods,
  };
}

export const BattleflyModSetForm = ({ data, onSubmit }) => {
  const modList = useMods();

  const { watch, control, setValue, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(data),
    resolver: yupResolver(schema),
  });
  const mods = watch('mods');

  const isEdit = data !== true;

  return (
    <div>
      <Typography paragraph variant="h5">
        {isEdit ? 'Edit Mod Set' : 'Create Mod Set'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput name="name" control={control} label="Name" disabled={isEdit} fullWidth />

        <Autocomplete
          disablePortal
          options={modList}
          renderInput={(params) => <TextField {...params} label="Mods" fullWidth />}
          value={mods}
          onChange={(_, value) => {
            setValue('mods', value);
          }}
          getOptionLabel={(item) => item.name + ' (' + item.id.slice(0, 5) + ') - (' + item.type + ')'}
          isOptionEqualToValue={() => false}
          multiple
          fullWidth
        />

        <FormErrors state={formState} />

        <Button type="submit" variant="contained">
          {isEdit ? 'Edit' : 'Create'}
        </Button>
      </form>
    </div>
  );
};
