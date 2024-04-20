'use client';

import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';
import { GoogleMapLoader } from '@/app/components/GoogleMapLoader/GoogleMapLoader';
import { usePlaceController } from '@/app/hooks/formControllers/usePlaceController';

export interface SearchLocationProps {
  onAutoCompleteChange: (...event: any[]) => void;
  onAutoCompleteEmpty: (...event: any[]) => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onAutoCompleteChange, onLoadAutocomplete, onAutoCompleteEmpty }: SearchLocationProps) => {
  const { error, ref, isDirty, value } = usePlaceController();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isDirty && value?.formatted_address) {
      setInputValue(value.formatted_address);
      onAutoCompleteChange();
    }
  }, [value?.formatted_address, onAutoCompleteChange, isDirty]);

  const handleAutoCompleteOnChange = () => {
    onAutoCompleteChange();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.value === '') {
      onAutoCompleteEmpty();
    }
  };

  const handleAutoCompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    onLoadAutocomplete(autocomplete);
  };

  return (
    <GoogleMapLoader>
      <Autocomplete onPlaceChanged={handleAutoCompleteOnChange} onLoad={handleAutoCompleteLoad}>
        <TextField
          inputRef={ref}
          value={inputValue} // Bind TextField value to state
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
