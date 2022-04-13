import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export function TextInput({ name, control, ...other }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <TextField {...field} variant="outlined" {...other} />}
      />
    </div>
  );
}
