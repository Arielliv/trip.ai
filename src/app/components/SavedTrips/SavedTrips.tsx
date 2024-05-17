'use client';
import React, { useCallback } from 'react';
import { CircularProgress, List, ListItem, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MapMarker } from '@/app/components/Map/Map';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { DataTestIds } from '@/app/components/constants/constants';

export interface SavedTripsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedTrips = ({ setSelectedTab }: SavedTripsProps) => {
  const { trips, loadTrips, loading, hasMore, removeTrip } = useTripContext();
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

  const handleEdit = (id: string) => {
    router.push(pathname + '?' + createQueryString('id', id));
    setSelectedTab('0');
  };

  const handleDelete = (id: string) => {
    removeTrip(id);
  };

  const handleSelect = (coordinate: Omit<MapMarker, 'id'>) => {};

  return (
    <InfiniteScroll
      height={'90vh'}
      scrollableTarget="tripsScrollableContiner"
      dataLength={trips.length}
      next={loadTrips}
      hasMore={!loading && hasMore}
      loader={
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      }
      endMessage={<p style={{ textAlign: 'center' }}>No more trips</p>}
    >
      <List>
        {trips.map((trip, index) => (
          <ListItem key={index} data-testid={DataTestIds.savedTripAt(index)}>
            <div>{trip.name}</div>
            {/*<LocationCard location={location} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} />*/}
          </ListItem>
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default SavedTrips;
