import { Autocomplete, Button,  TextField } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox } from '../../components/Checkbox';
import { TextInput } from '../../components/TextInput';

import { Section } from '../../components/Section';
import { useBattleflies } from '../../data-layer/useBattleflies';

export const SelectBattleflies = ({ onStart }) => {
  const battleflies = useBattleflies();
  const {  watch, setValue, control, handleSubmit  } = useForm({
    defaultValues: {
      battleflies: [],
      totalTime: 24,
      timeBetweenBattles: 3,
      missBattles: 10,
      selectAll: false,
      selectIconic: true
    }
  });
  const selected = watch('battleflies');
  const selectAll = watch('selectAll');
  const selectIconic = watch('selectIconic');

  useEffect(() => {
    if(!selectAll) {
      setValue('battleflies', [])
    } else {
      setValue('battleflies', battleflies);
    }
  }, [selectAll, battleflies, setValue]);

  useEffect(() => {
    if(!selectIconic) {
      setValue('battleflies', [])
    } else {
      setValue('battleflies', battleflies.filter(item => item.iconic));
    }
  }, [selectIconic, battleflies, setValue]);

  const onStartHandler = handleSubmit((data) => onStart({
        battleflies: data.battleflies,
        timeBetweenBattles: parseInt(data.timeBetweenBattles, 10),
        totalTime: parseInt(data.totalTime, 10),
        missBattles: parseInt(data.missBattles, 10)
      }));

  return <div>
  <Section>
    <Autocomplete
    disablePortal
    options={battleflies}
    renderInput={(params) => <TextField {...params} label="Battleflies" fullWidth />}
    value={selected}
    onChange={(_, value) => {
      setValue(`battleflies`, value);
    }}
    getOptionLabel={(item) => item.name}
    isOptionEqualToValue={(option, value) => option.id === value.id}
    fullWidth
    multiple
  />
  <br />
  <TextInput type="number" name="timeBetweenBattles" control={control} label="Period between the battles (in minutes)" fullWidth />
  <br />
  <TextInput type="number" name="totalTime" control={control} label="How long to emulate (in hours)" fullWidth />
  <br />
  <TextInput type="number" name="missBattles" control={control} label="Rearm and Reload (How many battles do BFs miss after a battle?)" fullWidth />
  <br />
  <Checkbox name="selectIconic" control={control} label="Select Iconics" />

  <Checkbox name="selectAll" control={control} label="Select All Battleflies" />

  <Button variant="contained" onClick={onStartHandler}>Start Hyperdome</Button>
</Section>
</div>
};
