import { Paper } from '@mui/material';

export const Section = ({ children, ...others }) => {
  return (
    <Paper style={{ padding: 20 }} {...others}>
      {children}
    </Paper>
  );
};
