'use client';

import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';
import { GoogleMapLoader } from '@/app/components/GoogleMapLoader/GoogleMapLoader';
import { useController } from 'react-hook-form';
import { useLocationForm } from '@/app/hooks/useLocationForm';

export interface SearchLocationProps {
  onPlaceChange: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onPlaceChange, onLoadAutocomplete }: SearchLocationProps) => {
  const { control } = useLocationForm(); // Access form context
  const {
    field, // contains onChange, onBlur, value, ref
    fieldState: { error },
  } = useController({
    name: 'place',
    control,
    rules: { required: 'Location is required' }, // Define rules here for validation
    defaultValue: {}, // Default value for the field
  });

  return (
    <GoogleMapLoader>
      <Autocomplete onPlaceChanged={onPlaceChange} onLoad={onLoadAutocomplete}>
        <TextField
          {...field}
          label="Search location"
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error ? error.message : ''}
          inputRef={field.ref}
        />
      </Autocomplete>
    </GoogleMapLoader>
  );
};

export default SearchLocation;
