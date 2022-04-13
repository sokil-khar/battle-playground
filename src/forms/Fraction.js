import { Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { TextInput } from '../components/TextInput';
import { FormErrors } from '../components/FormErrors';
import { Section } from '../components/Section';
import { SelectInput } from '../components/SelectInput';
import { traitFormatter } from '../columns/formatters';
import { useTraits } from '../data-layer/useTraits';

const schema = Yup.object({
  name: Yup.string().required(),
  trait: Yup.string().required(),
}).required();

function getDefaultValues(fraction) {
  if (fraction) {
    return {
      ...fraction,
      trait: fraction.trait ? fraction.trait.id : fraction.trait,
    };
  }

  return {
    name: 'Test Name',
    trait: '1',
  };
}

export const FractionForm = ({ fraction, mode, onSubmit }) => {
  const { control, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(fraction),
    resolver: yupResolver(schema),
  });

  const traits = useTraits();
  const traitOptions = traits.reduce((a, c) => ({ ...a, [c.id]: traitFormatter(c) }), {});

  return (
    <div>
      <Section>
        <Typography paragraph variant="h5">
          {mode === 'edit' ? 'Edit ' : 'Create '}
          Faction
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Name" name="name" control={control} fullWidth />

          <SelectInput
            label="Attribute"
            name="trait"
            control={control}
            options={traitOptions}
            fullWidth
          />

          <FormErrors state={formState} />

          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Section>
    </div>
  );
};
