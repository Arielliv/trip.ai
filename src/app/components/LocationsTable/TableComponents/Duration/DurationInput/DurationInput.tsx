import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';

export const timeUnits = [
  { value: 'hours', label: 'hour(s)' },
  { value: 'minutes', label: 'min(s)' },
  { value: 'seconds', label: 'sec(s)' },
];

export const DurationInput = ({ value, id, field, hasFocus }: GridRenderEditCellParams) => {
  const apiRef = useGridApiContext();
  const ref = useRef();
  const [amount, unit] = value ? value.split(' ') : [0, 'hours'];
  const [number, setNumber] = useState(amount);
  const [timeUnit, setTimeUnit] = useState(unit);

  useLayoutEffect(() => {
    if (hasFocus) {
      // @ts-ignore
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
    updateDuration(parseInt(event.target.value), timeUnit);
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeUnit(event.target.value);
    updateDuration(number, event.target.value);
  };

  const updateDuration = (number: number, unit: string) => {
    const newDuration = `${number} ${unit}`;
    apiRef.current.setEditCellValue({ id, field, value: newDuration });
  };

  return (
    <Box ref={ref} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        type="number"
        value={number}
        onChange={handleNumberChange}
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        sx={{ width: '80px' }}
      />
      <TextField select value={timeUnit} onChange={handleUnitChange} size="small" sx={{ width: '120px' }}>
        {timeUnits.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
