'use client';

import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';
import { GoogleMapLoader } from '@/app/components/GoogleMapLoader/GoogleMapLoader';
import { usePlaceController } from '@/app/hooks/formControllers/usePlaceController';

export interface SearchLocationProps {
  onAutoCompleteChange: (...event: any[]) => void;
  onAutoCompleteEmpty: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onAutoCompleteChange, onLoadAutocomplete, onAutoCompleteEmpty }: SearchLocationProps) => {
  const { error, ref } = usePlaceController();

  const handleAutoCompleteOnChange = () => {
    onAutoCompleteChange();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      onAutoCompleteEmpty();
    }
  };

  return (
    <GoogleMapLoader>
      <Autocomplete onPlaceChanged={handleAutoCompleteOnChange} onLoad={onLoadAutocomplete}>
        <TextField
          inputRef={ref}
          label="Search location"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          error={!!error}
          helperText={error ? error.message : ''}
        />
      </Autocomplete>
    </GoogleMapLoader>
  );
};

export default SearchLocation;
