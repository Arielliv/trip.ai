import React from 'react';
import { Chip, Typography } from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';

const LocationCounter = ({ value = 0 }: { value: number }) => {
  return (
    <Chip
      icon={<NumbersIcon />}
      label={
        <Typography component={'span'} sx={{ display: 'flex', alignItems: 'center', wordWrap: 'break-word' }}>
          Holds {value} location inside
        </Typography>
      }
      sx={{ fontSize: '0.875rem', fontWeight: 'medium', height: 'auto', padding: '10px' }}
    />
  );
};

export default LocationCounter;
