'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { useLocationNameController } from '@/app/hooks/formControllers/useLocationNameController';
import { useLocationTypeController } from '@/app/hooks/formControllers/useLocationTypeController';
import { LocationFormData } from '@/app/hooks/forms/useLocationForm';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { useOnLocationFormSubmit } from '@/app/hooks/formSubmission/useOnLocationFormSubmit';
import { useLocationNoteController } from '@/app/hooks/formControllers/useLocationNoteController';
import { FileUploader } from '@/app/components/FileUploader/FileUploader';

const LocationForm = () => {
  const { onSubmit } = useOnLocationFormSubmit();
  const { onAutoCompletePlaceChange, onLoadAutocomplete, onAutoCompletePlaceEmpty, isEditMode, clearFormOnEditState } =
    useLocationContext();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<LocationFormData>();
  const { field: locationNameField, error: locationNameError } = useLocationNameController();
  const { field: locationTypeField } = useLocationTypeController();
  const { field: noteField } = useLocationNoteController();

  const handlePlaceChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    onAutoCompletePlaceChange();
  };

  const handlePlaceEmpty = (_event: React.ChangeEvent<HTMLInputElement>) => {
    onAutoCompletePlaceEmpty();
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
        <Grid xs={12} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Location Type</InputLabel>
            <Select {...locationTypeField} label="Location Type" defaultValue="general" fullWidth>
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="restaurant">Restaurant</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <TextField label="Note" variant="outlined" multiline rows={4} fullWidth {...noteField} />
        </Grid>
        <Grid xs={12}>
          <FileUploader />
        </Grid>
        <Grid xs={12}>
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button
            color="secondary"
            variant="outlined"
            type={'submit'}
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

export default LocationForm;
