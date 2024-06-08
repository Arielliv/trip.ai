'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, FormControlLabel, Switch, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { TripFormData } from '@/app/hooks/useTripForm';
import { useTripNameController } from '@/app/hooks/formControllers/useTripNameController';
import { useOnTripFormSubmit } from '@/app/hooks/useOnTripFormSubmit';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { useTripVisibilityController } from '@/app/hooks/formControllers/useTripVisibilityController';

const TripForm = () => {
  const { clearFormOnEditState } = useTripContext();
  const { handleSubmit, formState } = useFormContext<TripFormData>();
  const { field: tripNameField, error: tripNameError } = useTripNameController();
  const { field: visibilityField } = useTripVisibilityController();
  const { onSubmit } = useOnTripFormSubmit();
  console.log(visibilityField.value);
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} flexDirection="column">
        <Grid container alignItems={'center'}>
          <Grid xs={9}>
            <TextField
              error={!!tripNameError}
              label="Trip Name"
              helperText={tripNameError?.message && 'Trip name is required'}
              variant="outlined"
              fullWidth
              {...tripNameField}
            />
          </Grid>
          <Grid xs={3} alignItems="center">
            <FormControlLabel
              control={<Switch {...visibilityField} />}
              label={visibilityField.value ? 'Public' : 'Private'}
              checked={visibilityField.value}
              defaultValue="Private"
            />
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
