'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { useLocationNameController } from '@/app/hooks/formControllers/useLocationNameController';
import { useLocationTypeController } from '@/app/hooks/formControllers/useLocationTypeController';
import { useLocationPrivacyController } from '@/app/hooks/formControllers/useLocationPrivacy';
import { useLocationNoteController } from '@/app/hooks/formControllers/useLocationNote';
import { LocationFormData } from '@/app/hooks/useLocationForm';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { usePlaceController } from '@/app/hooks/formControllers/usePlaceController';
import { useOnLocationFormSubmit } from '@/app/hooks/useOnLocationFormSubmit';

const LocationForm = () => {
  const {
    onAutoCompletePlaceChange,
    onLoadAutocomplete,
    onAutoCompletePlaceEmpty,
    addLocation,
    editLocation,
    isEditMode,
    clearFormOnEditState,
  } = useLocationContext();
  const { watch, handleSubmit, formState } = useFormContext<LocationFormData>();
  const { field: locationNameField, error: locationNameError } = useLocationNameController();
  const { field: locationTypeField } = useLocationTypeController();
  const { field: privacyField } = useLocationPrivacyController();
  const { field: noteField } = useLocationNoteController();
  const { onSubmit } = useOnLocationFormSubmit(addLocation);
  const { onChange: onPlaceChange } = usePlaceController();

  const privacy = watch('privacy');

  const handlePlaceChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    onAutoCompletePlaceChange(onPlaceChange);
  };

  const handlePlaceEmpty = (_event: React.ChangeEvent<HTMLInputElement>) => {
    onAutoCompletePlaceEmpty(onPlaceChange);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} flexDirection="column">
        <Grid xs={12}>
          <SearchLocation
            isEditMode={isEditMode}
            onAutoCompleteEmpty={handlePlaceEmpty}
            onAutoCompleteChange={handlePlaceChange}
            onLoadAutocomplete={onLoadAutocomplete}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            error={!!locationNameError}
            label="Location Name"
            helperText={locationNameError?.message && 'Location name is required'}
            variant="outlined"
            fullWidth
            {...locationNameField}
          />
        </Grid>
        <Grid xs={12} container spacing={2} alignItems="center">
          <Grid xs={8}>
            <FormControl fullWidth>
              <InputLabel>Location Type</InputLabel>
              <Select {...locationTypeField} label="Location Type" defaultValue="general" fullWidth>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="hotel">Hotel</MenuItem>
                <MenuItem value="restaurant">Restaurant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={4}>
            <FormControlLabel
              control={<Switch checked={privacy} {...privacyField} />}
              label={privacy ? 'Public' : 'Private'}
            />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <TextField label="Note" variant="outlined" multiline rows={4} fullWidth {...noteField} />
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
          <Button color="secondary" variant="outlined" fullWidth onClick={clearFormOnEditState}>
            {'Clear'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationForm;
