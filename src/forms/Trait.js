import { Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { TextInput } from '../components/TextInput';
import { FormErrors } from '../components/FormErrors';
import { Section } from '../components/Section';
import { SelectInput } from '../components/SelectInput';
import { StatsData } from '../data/constants';
import { traitFormatter } from '../columns/formatters';

const schema = Yup.object({
  action: Yup.string().required(),
  data: Yup.object({
    attributeName: Yup.string().required(),
    attributeValue: Yup.number().required(),
  }),
}).required();

function getDefaultValues(trait) {
  if (trait) {
    return trait;
  }

  return {
    action: 'addValue',
    data: {
      attributeName: 'hp',
      attributeValue: 0,
    },
  };
}

const actionOptions = {
  addValue: 'Add Value',
  addPercentage: 'Add Percentage',
  addWeaponPercentage: 'Add Weapon Stat Percentage',
  addWeaponDamageByType: 'Add Weapon Damage By Type',
};

const attributesOptions = Object.keys(StatsData).reduce(
  (a, c) => ({ ...a, [c]: StatsData[c].name }),
  {}
);

const weaponAttribute = {
  fireRate: 'Fire Rate',
  damagePerFire: 'Damage Per Fire',
  reload: 'Reload',
};

const damageTypeAttribute = {
  Kinetic: 'Kinetic',
  Missile: 'Missile',
  Energy: 'Energy',
  Nuclear: 'Nuclear',
  Electric: 'Electric',
};

function getOptionsByAction(action) {
  switch (action) {
    case 'addWeaponPercentage':
      return weaponAttribute;

    case 'addWeaponDamageByType':
      return damageTypeAttribute;

    default:
      return attributesOptions;
  }
}

export const TraitForm = ({ trait, mode, onSubmit }) => {
  const { watch, control, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(trait),
    resolver: yupResolver(schema),
  });
  const fields = watch();

  return (
    <div>
      <Section>
        <Typography paragraph variant="h5">
          {mode === 'edit' ? 'Edit ' : 'Create '}
          Trait
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <SelectInput
            label="Action"
            name="action"
            control={control}
            options={actionOptions}
            fullWidth
          />

          <SelectInput
            label="Attribute"
            name="data.attributeName"
            control={control}
            options={getOptionsByAction(fields.action)}
            fullWidth
          />

          <TextInput label="Value" name="data.attributeValue" control={control} fullWidth />

          <Typography>
            Result: <b>{traitFormatter(fields)}</b>
          </Typography>

          <FormErrors state={formState} />

          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Section>
    </div>
  );
};
