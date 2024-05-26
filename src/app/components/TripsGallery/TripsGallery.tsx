import { Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce';
import { useTripsSearchContext } from '@/app/providers/TripsSearchContextProvider/TripContextFormProvider';
import { TripCard } from '@/app/components/TripCard/TripCard';
import { SearchTripInput } from '@/app/components/SearchTripInput/SearchTripInput';

export const TripsGallery = () => {
  const { searchTripsHandler, trips, loading, hasMore } = useTripsSearchContext();
  const [searchTerm, setSearchTerm] = useState('');
  const searchTripsHandlerDebounced = debounce(searchTripsHandler, 1000);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    void searchTripsHandlerDebounced(searchTerm, 0);
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
          next={searchTripsHandler}
          hasMore={!loading && hasMore}
          loader={
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress />
            </Box>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You have seen it all</b>
            </p>
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
