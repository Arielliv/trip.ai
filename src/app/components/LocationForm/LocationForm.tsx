'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { useLocationContext } from '@/app/components/MyLocation/LocationDataContext';

const LocationForm = () => {
  const { onPlaceChange, onLoadAutocomplete } = useLocationContext();
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      locationName: '',
      locationType: '',
      privacy: false, // false for private, true for public
      note: '',
    },
  });

  // todo: add onSubmit logic + add data type
  const onSubmit = (data: any) => {
    console.log(data);
    // Simulate a submission delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Form submission simulated');
        resolve();
      }, 2000);
    });
    // Perform your submission logic here
  };

  const privacy = watch('privacy');

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SearchLocation onPlaceChange={onPlaceChange} onLoadAutocomplete={onLoadAutocomplete} />

        <TextField label="Location Name" variant="outlined" {...register('locationName')} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel>Location Type</InputLabel>
            <Select {...register('locationType')} label="Location Type" defaultValue="">
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="restaurant">Restaurant</MenuItem>
              {/* Add more location types as needed */}
            </Select>
          </FormControl>

          <FormControlLabel control={<Switch {...register('privacy')} />} label={privacy ? 'Public' : 'Private'} />
        </Box>

        <TextField label="Note" variant="outlined" multiline rows={4} {...register('note')} />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </form>
    </Box>
  );
};

export default LocationForm;
