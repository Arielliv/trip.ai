'use client';
import React, { useCallback } from 'react';
import { CircularProgress, List, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { TripListItem } from '@/app/components/TripListItem/TripListItem';

export interface SavedTripsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedTrips = ({ setSelectedTab }: SavedTripsProps) => {
  const { trips, fetchNextPage, isLoading, hasNextPage, removeTrip } = useTripContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleEdit = (id?: string) => {
    if (!id) return;

    router.push(pathname + '?' + createQueryString('id', id));
    setSelectedTab('0');
  };

  const handleDelete = (id?: string) => {
    if (!id) return;

    removeTrip(id);
  };

  const handleSelect = (id?: string) => {
    if (!id) return;
    router.push('/locations?' + createQueryString('tripId', id));
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
            handleSelect={handleSelect}
          />
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default SavedTrips;
