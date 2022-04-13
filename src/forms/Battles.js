import { Autocomplete, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { v4 as uuidv4 } from 'uuid';

import { FormErrors } from '../components/FormErrors';

import { useBattleflies } from '../data-layer/useBattleflies';
import { Section } from '../components/Section';
import { TextInput } from '../components/TextInput';

const schema = Yup.object({
  battles: Yup.array().required(),
  count: Yup.number().optional(),
}).required();

function getDefaultValues() {
  return {
    battles: [
      {
        id: uuidv4(),
        firstBattlefly: { id: 'Select BF', name: '', modSets: [] },
        firstBattleflyModSet: null,
        secondBattlefly: { id: 'Select BF', name: '', modSets: [] },
        secondBattleflyModSet: null,
      },
    ],
  };
}

export const BattlesForm = ({ loading, multiple = false, onSubmit }) => {
  const battleflies = useBattleflies();

  const { watch, setValue, control, handleSubmit, formState } = useForm({
    defaultValues: getDefaultValues(),
    resolver: yupResolver(schema),
  });
  const currentBattles = watch('battles');

  const onBattleAdd = () => {
    setValue(
      'battles',
      currentBattles.concat({
        id: uuidv4(),
        firstBattlefly: { id: 'Select Battlefly', name: '', modSets: [] },
        firstBattleflyModSet: null,
        secondBattlefly: { id: 'Select Battlefly', name: '', modSets: [] },
        secondBattleflyModSet: null,
        useAllModSets: false,
      })
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentBattles.map((battle, idx) => {
          return (
            <Section key={battle.id} style={{ padding: 20, marginBottom: 20 }}>
              <Autocomplete
                disablePortal
                options={battleflies}
                renderInput={(params) => <TextField {...params} label="Battlefly #1" fullWidth />}
                value={battle.firstBattlefly}
                onChange={(_, value) => {
                  setValue(`battles.${idx}.firstBattlefly`, value);
                }}
                getOptionLabel={(item) => item.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
              />

              {battle.firstBattlefly?.modSets?.length > 0 && !battle.useAllModSets && (
                <Autocomplete
                  disablePortal
                  options={battle.firstBattlefly.modSets}
                  renderInput={(params) => <TextField {...params} label="Mod Set #1" fullWidth />}
                  value={battle.firstBattleflyModSet}
                  onChange={(_, value) => {
                    setValue(`battles.${idx}.firstBattleflyModSet`, value);
                  }}
                  getOptionLabel={(item) => item.name}
                  isOptionEqualToValue={(option, value) => option === value}
                  style={{ marginTop: 20 }}
                  fullWidth
                />
              )}

              <Autocomplete
                disablePortal
                options={battleflies}
                renderInput={(params) => <TextField {...params} label="Battlefly #2" fullWidth />}
                value={battle.secondBattlefly}
                onChange={(_, value) => {
                  setValue(`battles.${idx}.secondBattlefly`, value);
                }}
                getOptionLabel={(item) => item.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                style={{ marginTop: 40 }}
                fullWidth
              />

              {battle.secondBattlefly?.modSets?.length > 0 && (
                <Autocomplete
                  disablePortal
                  options={battle.secondBattlefly.modSets}
                  renderInput={(params) => <TextField {...params} label="Mod Set #2" fullWidth />}
                  value={battle.secondBattleflyModSet}
                  onChange={(_, value) => {
                    setValue(`battles.${idx}.secondBattleflyModSet`, value);
                  }}
                  getOptionLabel={(item) => item.name}
                  isOptionEqualToValue={(option, value) => option === value}
                  style={{ marginTop: 20 }}
                  fullWidth
                />
              )}
            </Section>
          );
        })}

        {multiple && (
          <TextInput name="count" control={control} label="Count of battles" fullWidth />
        )}

        {!multiple && (
          <Button style={{ marginTop: 20 }} onClick={onBattleAdd} type="button">
            Add Battles
          </Button>
        )}

        <FormErrors state={formState} />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Please, wait. We emulate battles. It can take some time...' : 'Start Battles'}
        </Button>
      </form>
    </div>
  );
};
