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
            Here you can arrange your trip by adding locations with extra information about them.
          </Typography>
          <Typography component={'p'} variant="body1">
            It can be dates, time duration or even cost, try it to find out
          </Typography>
        </Grid>
        <Grid xs={12} sx={{ height: '700px' }}>
          <LocationsTable />
        </Grid>
      </Grid>
    </Grid>
  );
};
