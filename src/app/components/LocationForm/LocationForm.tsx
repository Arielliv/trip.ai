'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} flexDirection="column">
          <Grid xs={12}>
            <SearchLocation onPlaceChange={onPlaceChange} onLoadAutocomplete={onLoadAutocomplete} />
          </Grid>
          <Grid xs={12}>
            <TextField label="Location Name" variant="outlined" fullWidth {...register('locationName')} />
          </Grid>

          <Grid xs={12} container spacing={2} alignItems="center">
            <Grid xs={8}>
              <FormControl fullWidth>
                <InputLabel>Location Type</InputLabel>
                <Select {...register('locationType')} label="Location Type" defaultValue="general" fullWidth>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="restaurant">Restaurant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={4}>
              <FormControlLabel control={<Switch {...register('privacy')} />} label={privacy ? 'Public' : 'Private'} />
            </Grid>
          </Grid>
          <Grid xs={12}>
            <TextField label="Note" variant="outlined" multiline rows={4} fullWidth {...register('note')} />
          </Grid>
          <Grid xs={12}>
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LocationForm;
