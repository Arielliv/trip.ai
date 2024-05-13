'use client';

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { MyLocationDataTestIds } from '@/app/components/constants/constants';
import { CustomizedTabs } from '@/app/components/CustomaziedTabs/CustomizedTabs';
import TripForm from '@/app/components/TripForm/TripForm';
import SavedTrips from '@/app/components/SavedTrips/SavedTrips';
import { TripContextFormProvider } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { LocationsTable } from '@/app/components/LocationsTable/LocationsTable';

const MyTrips = () => {
  return (
    <TripContextFormProvider>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          xs={3}
          sx={{ borderRight: 1, borderColor: 'divider' }}
          data-testid={MyLocationDataTestIds.locationTabsContainer}
        >
          <CustomizedTabs
            tabs={[
              { title: 'New trip', element: TripForm },
              { title: 'Saved trip', element: SavedTrips },
            ]}
            dataTestPrefix={'trip-tab'}
          />
        </Grid>
        <Grid xs={9} sx={{ overflow: 'hidden' }} data-testid={MyLocationDataTestIds.mapContainer}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <LocationsTable />
          </Box>
        </Grid>
      </Grid>
    </TripContextFormProvider>
  );
};

export default MyTrips;
