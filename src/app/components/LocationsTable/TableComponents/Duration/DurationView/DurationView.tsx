import { Box } from '@mui/material';
import React from 'react';

export interface DurationViewProps {
  value: string;
}

export const DurationView = ({ value }: DurationViewProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {value ? value : `-`}
    </Box>
  );
};
