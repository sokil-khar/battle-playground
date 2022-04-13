import { FormControlLabel, FormGroup, Checkbox as MuiCheckbox } from '@mui/material';
import { Controller } from 'react-hook-form';

export function Checkbox({ name, control, label = '', ...other }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <MuiCheckbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  {...other}
                />
              )}
            />
          }
          label={label}
        />
      </FormGroup>
    </div>
  );
}
