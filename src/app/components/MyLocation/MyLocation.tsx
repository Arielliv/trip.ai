'use client';

import Map from '@/app/components/Map/Map';
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { MyLocationDataTestIds } from '@/app/components/constants/constants';
import { LocationContextFormProvider } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import LocationForm from '@/app/components/Forms/LocationForm/LocationForm';
import SavedLocations from '@/app/components/SavedLocations/SavedLocations';
import { CustomizedTabs } from '@/app/components/CustomaziedTabs/CustomizedTabs';

const MyLocation = () => {
  return (
    <LocationContextFormProvider>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          xs={3}
          sx={{ borderRight: 1, borderColor: 'divider' }}
          data-testid={MyLocationDataTestIds.locationTabsContainer}
        >
          <CustomizedTabs
            tabs={[
              { title: 'New location', element: LocationForm },
              { title: 'Saved locations', element: SavedLocations },
            ]}
          />
        </Grid>
        <Grid xs={9} sx={{ overflow: 'hidden' }} data-testid={MyLocationDataTestIds.mapContainer}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Map />
          </Box>
        </Grid>
      </Grid>
    </LocationContextFormProvider>
  );
};

export default MyLocation;
