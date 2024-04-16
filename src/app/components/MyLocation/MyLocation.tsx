'use client';

import Map from '@/app/components/Map/Map';
import React from 'react';
import { LocationDataProvider } from '@/app/providers/LocationDataProvider/LocationDataContext';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { LocationTabs } from '@/app/components/LocationTabs/LocationTabs';
import { MyLocationDataTestIds } from '@/app/components/constants/constants';
import { LocationFormProvider } from '../../providers/LocationFormProvider/LocationFormProvider';

const MyLocation = () => {
  return (
    <LocationFormProvider>
      <LocationDataProvider>
        <Grid container sx={{ height: '100vh' }}>
          <Grid
            xs={3}
            sx={{ borderRight: 1, borderColor: 'divider' }}
            data-testid={MyLocationDataTestIds.locationTabsContainer}
          >
            <LocationTabs />
          </Grid>
          <Grid xs={9} sx={{ overflow: 'hidden' }} data-testid={MyLocationDataTestIds.mapContainer}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Map />
            </Box>
          </Grid>
        </Grid>
      </LocationDataProvider>
    </LocationFormProvider>
  );
};

export default MyLocation;
