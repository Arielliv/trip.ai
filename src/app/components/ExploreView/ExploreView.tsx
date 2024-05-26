'use client';

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { ExploreDataTestIds } from '@/app/components/constants/constants';
import { TripsGallery } from '@/app/components/TripsGallery/TripsGallery';
import { TripsSearchContextProvider } from '@/app/providers/TripsSearchContextProvider/TripContextFormProvider';

const ExploreView = () => {
  return (
    <TripsSearchContextProvider>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          xs={3}
          sx={{ borderRight: 1, borderColor: 'divider' }}
          data-testid={ExploreDataTestIds.exploreTagsContainer}
        ></Grid>
        <Grid xs={9} sx={{ overflow: 'hidden' }} data-testid={ExploreDataTestIds.tripsGalleryContainer}>
          <TripsGallery />
        </Grid>
      </Grid>
    </TripsSearchContextProvider>
  );
};

export default ExploreView;
