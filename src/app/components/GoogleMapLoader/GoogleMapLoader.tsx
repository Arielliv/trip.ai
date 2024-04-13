import * as React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';

export const GoogleMapLoader = ({ children }: React.PropsWithChildren) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'fallback_api_key_here',
    libraries: ['places'],
  });

  if (loadError) {
    console.error('Error loading Google Maps', loadError);
    return <div>Error loading maps</div>; // Or handle the error some other way
  }

  if (!isLoaded) {
    return <CircularProgress />; // Display a spinner while the API is loading
  }

  return <>{children}</>;
};
