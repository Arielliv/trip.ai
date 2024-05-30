'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, FormControl, FormControlLabel, InputLabel, Switch, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { useLocationPrivacyController } from '@/app/hooks/formControllers/useLocationPrivacy';
import { TripFormData, useTripForm } from '@/app/hooks/useTripForm';
import { useTripNameController } from '@/app/hooks/formControllers/useTripNameController';
import { useOnTripFormSubmit } from '@/app/hooks/useOnTripFormSubmit';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';

const TripForm = () => {
  const { clearFormOnEditState } = useTripContext();
  const { watch, handleSubmit, formState } = useFormContext<TripFormData>();
  const { field: tripNameField, error: tripNameError } = useTripNameController();
  const { field: privacyField } = useLocationPrivacyController();
  const { onSubmit } = useOnTripFormSubmit();

  const privacy = watch('privacy');

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} flexDirection="column">
        <Grid xs={12}>
          <TextField
            error={!!tripNameError}
            label="Trip Name"
            helperText={tripNameError?.message && 'Trip name is required'}
            variant="outlined"
            fullWidth
            {...tripNameField}
          />
        </Grid>
        <Grid xs={12} container spacing={2} alignItems="center">
          <Grid xs={8}>
            <FormControl fullWidth>
              <InputLabel>Location Type</InputLabel>
            </FormControl>
          </Grid>
          <Grid xs={4}>
            <FormControlLabel control={<Switch {...privacyField} />} label={privacy ? 'Public' : 'Private'} />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formState.isSubmitting}
            onClick={!formState.isSubmitting ? handleSubmit(onSubmit) : undefined}
          >
            {formState.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button
            color="secondary"
            variant="outlined"
            fullWidth
            onClick={(event) => {
              event.preventDefault();
              clearFormOnEditState();
            }}
          >
            {'Clear'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TripForm;
