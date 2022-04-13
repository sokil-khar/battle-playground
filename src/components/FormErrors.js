import { Typography } from '@mui/material';

export function FormErrors({ state }) {
  if (!state.errors) return null;

  const errors = [];
  for (const error in state.errors) {
    for (const item in state.errors[error]) {
      errors.push(state.errors[error][item].message);
    }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      {errors.map((error) => (
        <Typography key={error} style={{ color: 'red' }}>
          {error}
        </Typography>
      ))}
    </div>
  );
}
