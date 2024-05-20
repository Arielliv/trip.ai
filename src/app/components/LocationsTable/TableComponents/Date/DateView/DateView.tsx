import { Box, Typography } from '@mui/material';
import React from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';

export interface DateViewProps {
  value: DateRange<Date>;
  justifyContent?: string;
  color?: string;
}

export const DateView = ({ value, justifyContent = 'center', color = 'text.primary' }: DateViewProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent, alignItems: 'center', height: '100%' }}>
      <Typography sx={{ display: 'inline' }} component="span" variant="body1" color={color}>
        {value && value[0] ? value[0]?.toLocaleDateString() : '-'} -{' '}
      </Typography>
      <Typography sx={{ display: 'inline' }} component="span" variant="body1" color={color}>
        {value && value[1] ? value[1]?.toLocaleDateString() : ''}
      </Typography>
    </Box>
  );
};
