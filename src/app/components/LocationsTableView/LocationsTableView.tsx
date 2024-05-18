import Grid from '@mui/material/Unstable_Grid2';
import { LocationsTable } from '@/app/components/LocationsTable/LocationsTable';
import React from 'react';
import { Typography } from '@mui/material';

export const LocationsTableView = () => {
  return (
    <Grid container xs={12} justifyContent={'center'} padding={1}>
      <Grid container xs={11}>
        <Grid xs={12}>
          <Typography padding={1} variant="h4">
            Trip Dashboard
          </Typography>
        </Grid>
        <Grid xs={12} padding={1}>
          <Typography component={'p'} variant="body1">
            Here, you can plan your journey in detail. Start by adding each destination you wish to visit.
          </Typography>
          <Typography component={'p'} variant="body1">
            For every location, you can specify dates, the duration of stay, and estimated costs.
          </Typography>
          <Typography component={'p'} variant="body1">
            Customize your trip to match your schedule and budget. Explore the features below to enhance your itinerary!
          </Typography>
        </Grid>
        <Grid xs={12} sx={{ height: '700px' }}>
          <LocationsTable />
        </Grid>
      </Grid>
    </Grid>
  );
};
