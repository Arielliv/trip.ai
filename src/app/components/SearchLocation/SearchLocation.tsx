'use client';

import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';

export interface SearchLocationProps {
  onPlaceChange: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onPlaceChange, onLoadAutocomplete }: SearchLocationProps) => {
  return (
    <Autocomplete onPlaceChanged={onPlaceChange} onLoad={onLoadAutocomplete}>
      <TextField label="Search location" variant="outlined" fullWidth />
    </Autocomplete>
  );
};

export default SearchLocation;
