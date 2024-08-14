import { Box, CircularProgress, Typography } from '@mui/material';

export const SnackbarContentWithLoader = ({ message }: { message: string }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <Typography variant="body2" style={{ marginLeft: 8, marginRight: 8 }}>
        {message}
      </Typography>
      <Box display="flex" alignItems="center">
        <CircularProgress size={24} />
      </Box>
    </Box>
  );
};
