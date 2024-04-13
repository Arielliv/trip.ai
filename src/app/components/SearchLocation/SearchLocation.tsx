'use client';

import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';
import { GoogleMapLoader } from '@/app/components/GoogleMapLoader/GoogleMapLoader';

export interface SearchLocationProps {
  onPlaceChange: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onPlaceChange, onLoadAutocomplete }: SearchLocationProps) => {
  return (
    <GoogleMapLoader>
      <Autocomplete onPlaceChanged={onPlaceChange} onLoad={onLoadAutocomplete}>
        <TextField label="Search location" variant="outlined" fullWidth />
      </Autocomplete>
    </GoogleMapLoader>
  );
};

export default SearchLocation;
