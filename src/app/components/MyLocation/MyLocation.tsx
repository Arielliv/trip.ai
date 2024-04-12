'use client';

import Map from '@/app/components/Map/Map';
import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { LocationDataProvider } from '@/app/components/MyLocation/LocationDataContext';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { LocationTabs } from '@/app/components/LocationTabs/LocationTabs';

const MyLocation = () => {
  const placesLibrary = ['places' as any];

  return (
    <LocationDataProvider>
      <Grid container sx={{ height: '100vh' }}>
        <Grid xs={3} sx={{ borderRight: 1, borderColor: 'divider' }}>
          <LocationTabs />
        </Grid>
        <Grid xs={9} sx={{ overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <LoadScript
              libraries={placesLibrary}
              onError={(error) => console.error('There was an error loading the Google Maps API:', error)}
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'fallback_api_key_here'}
            >
              <Map />
            </LoadScript>
          </Box>
        </Grid>
      </Grid>
    </LocationDataProvider>
  );
};

export default MyLocation;
