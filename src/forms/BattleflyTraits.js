import { Autocomplete, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useTraits } from '../data-layer/useTraits';
import { FormErrors } from '../components/FormErrors';

import { traitFormatter } from '../columns/formatters';

const schema = Yup.object({
  traits: Yup.array().required(),
}).required();

function getDefaultValues(traits) {
  if (traits && traits.length) {
    return {
      traits,
    };
  }

  return {
    traits: [],
  };
}

export const BattleflyTraitsForm = ({ traits, onSubmit }) => {
  const traitList = useTraits();

  const { watch, setValue, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(traits),
    resolver: yupResolver(schema),
  });
  const currentTraits = watch('traits');

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Autocomplete
          disablePortal
          options={traitList}
          renderInput={(params) => <TextField {...params} label="Traits" fullWidth />}
          value={currentTraits}
          onChange={(_, value) => {
            setValue('traits', value);
          }}
          getOptionLabel={(item) => traitFormatter(item)}
          isOptionEqualToValue={() => false}
          multiple
          fullWidth
        />

        <FormErrors state={formState} />

        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </div>
  );
};
