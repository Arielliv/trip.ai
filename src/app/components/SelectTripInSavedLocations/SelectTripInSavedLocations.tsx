import React from 'react';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useManageTrips } from '@/app/hooks/useManageTrips';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { defaultTripId } from '@/app/components/constants/constants';
import InfiniteScroll from 'react-infinite-scroll-component';

export const SelectTripInSavedLocations = () => {
  const { trips, isLoading, hasNextPage, fetchNextPage } = useManageTrips();
  const { tripId, setTripId } = useLocationContext();

  const handleSelectChange = async (event: SelectChangeEvent) => {
    setTripId(event.target.value);
  };

  return (
    <Box sx={{ m: 1 }}>
      <FormControl fullWidth>
        <InputLabel>Select Trip</InputLabel>
        <InfiniteScroll
          scrollableTarget="usersScrollableContiner"
          dataLength={trips.length}
          next={() => fetchNextPage!()}
          hasMore={!isLoading && hasNextPage}
          loader={
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress />
            </Box>
          }
        >
          <Select
            label="Select Trip"
            defaultValue={defaultTripId}
            onChange={handleSelectChange}
            value={tripId ? tripId : defaultTripId}
            fullWidth
          >
            <MenuItem value={defaultTripId}>All Trips</MenuItem>
            {trips.map((trip) => (
              <MenuItem key={trip._id} value={trip._id}>
                {trip.name}
              </MenuItem>
            ))}
          </Select>
        </InfiniteScroll>
      </FormControl>
    </Box>
  );
};
