import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React, { useLayoutEffect, useRef } from 'react';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

export const DateRangeInput = ({ id, value, field, hasFocus }: GridRenderEditCellParams) => {
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hasFocus) {
      if (ref.current) {
        ref.current.focus();
      }
    }
  }, [hasFocus]);

  const handleValueChange = (newValue: DateRange<Date>) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          ref={ref}
          localeText={{ start: 'Start', end: 'End' }}
          value={value}
          onChange={handleValueChange}
        />
      </LocalizationProvider>
    </Box>
  );
};
