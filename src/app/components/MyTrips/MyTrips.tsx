'use client';

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { MyTripsDataTestIds } from '@/app/components/constants/constants';
import { CustomizedTabs } from '@/app/components/CustomaziedTabs/CustomizedTabs';
import TripForm from '@/app/components/Forms/TripForm/TripForm';
import SavedTrips from '@/app/components/SavedTrips/SavedTrips';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { LocationsTableView } from '@/app/components/LocationsTableView/LocationsTableView';

const MyTrips = () => {
  const { selectedTab, setSelectedTab } = useTripContext();
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid xs={3} sx={{ borderRight: 1, borderColor: 'divider' }} data-testid={MyTripsDataTestIds.tripTabsContainer}>
        <CustomizedTabs
          tabs={[
            { title: 'New trip', element: TripForm },
            { title: 'Saved trip', element: SavedTrips },
          ]}
          dataTestPrefix={'trip-tab'}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Grid>
      <Grid xs={9} sx={{ overflow: 'hidden' }} data-testid={MyTripsDataTestIds.locationsTableContainer}>
        <LocationsTableView />
      </Grid>
    </Grid>
  );
};

export default MyTrips;
