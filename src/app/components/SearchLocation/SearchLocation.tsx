'use client';

import React from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';

export interface SearchLocationProps {
  onPlaceChange: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const SearchLocation = ({ onPlaceChange, onLoadAutocomplete }: SearchLocationProps) => {
  const placesLibrary = ['places' as any];

  return (
    <LoadScript
      libraries={placesLibrary}
      onError={(error) => console.error('There was an error loading the Google Maps API:', error)}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'fallback_api_key_here'}
    >
      <Autocomplete onPlaceChanged={onPlaceChange} onLoad={onLoadAutocomplete}>
        <TextField label="Search location" variant="outlined" fullWidth />
      </Autocomplete>
    </LoadScript>
  );
};

export default SearchLocation;
