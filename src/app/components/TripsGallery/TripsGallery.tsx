import { Box, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TripCard } from '@/app/components/TripCard/TripCard';
import { SearchTripInput } from '@/app/components/SearchTripInput/SearchTripInput';
import { useTripsSearchContext } from '@/app/providers/TripsSearchContextProvider/TripsSearchContextProvider';

export const TripsGallery = () => {
  const { fetchNextPage, loadTrips, trips, isLoading, hasNextPage } = useTripsSearchContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearchTermBeenSet, setHasSearchTermBeenSet] = useState(false);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (!hasSearchTermBeenSet) {
      setHasSearchTermBeenSet(true);
    }
  };

  useEffect(() => {
    if (hasSearchTermBeenSet) {
      void loadTrips(searchTerm);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Grid container direction="column" alignItems="center" spacing={2} sx={{ marginTop: 2, padding: 2 }}>
      <Grid xs={12} container justifyContent="start">
        <Grid xs={12} md={5}>
          <SearchTripInput onInputChange={handleInputChange} />
        </Grid>
      </Grid>
      <Grid xs={12} sx={{ marginTop: 2, padding: 2 }}>
        <InfiniteScroll
          dataLength={trips.length}
          next={() => fetchNextPage!()}
          hasMore={!isLoading && hasNextPage}
          loader={
            <Grid xs={12} sx={{ marginTop: 2, padding: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            </Grid>
          }
          endMessage={
            <Grid xs={12} sx={{ marginTop: 2, padding: 2 }}>
              <Typography variant={'h6'} style={{ textAlign: 'center' }}>
                You have seen it all
              </Typography>
            </Grid>
          }
        >
          <Grid container spacing={2}>
            {trips.map((trip, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                <TripCard trip={trip} index={index} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Grid>
    </Grid>
  );
};
