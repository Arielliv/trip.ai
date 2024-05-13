import { Box } from '@mui/material';
import React from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';

export interface DateViewProps {
  value: DateRange<Date>;
}

export const DateView = ({ value }: DateViewProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {value && value[0] ? value[0]?.toLocaleDateString() : ''} -{' '}
      {value && value[1] ? value[1]?.toLocaleDateString() : ''}
    </Box>
  );
};
