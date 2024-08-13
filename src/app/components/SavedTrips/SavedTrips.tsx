'use client';
import React from 'react';
import { CircularProgress, List, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { TripListItem } from '@/app/components/TripListItem/TripListItem';
import { useNavigateToLocationPageByTripId } from '@/app/hooks/useNavigateToLocationPageByTripId';

export interface SavedTripsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedTrips = ({ setSelectedTab }: SavedTripsProps) => {
  const { trips, fetchNextPage, isLoading, hasNextPage, removeTrip, setTripId } = useTripContext();
  const { navigateToLocationPageByTripId } = useNavigateToLocationPageByTripId();

  const handleEdit = (id?: string) => {
    if (!id) return;
    setTripId(id);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;

    removeTrip(id);
  };

  return (
    <InfiniteScroll
      height={'90vh'}
      scrollableTarget="tripsScrollableContiner"
      dataLength={trips.length}
      next={() => fetchNextPage!()}
      hasMore={!isLoading && hasNextPage}
      loader={
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      }
      endMessage={<p style={{ textAlign: 'center' }}>No more trips</p>}
    >
      <List sx={{ justifyContent: 'center' }}>
        {trips.map((trip, index) => (
          <TripListItem
            key={trip._id}
            trip={trip}
            index={index}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSelect={navigateToLocationPageByTripId}
          />
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default SavedTrips;
