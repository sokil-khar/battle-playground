import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

export function SelectInput({ name, control, label, options, ...other }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={label}>{label}</InputLabel>

            <Select {...field} options={options} labelId={label} {...other}>
              {Object.entries(options).map(([key, value]) => (
                <MenuItem key={value} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </div>
  );
}
