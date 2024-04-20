'use client';
import React, { useCallback } from 'react';
import { CircularProgress, List, ListItem, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocationContext } from '@/app/providers/LocationDataProvider/LocationDataContext';
import { LocationCard } from '@/app/components/LocationCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MapMarker } from '@/app/components/Map/Map';

export interface SavedLocationsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedLocations = ({ setSelectedTab }: SavedLocationsProps) => {
  const { locations, loadLocations, loading, hasMore, handleFocusLocation, removeLocation } = useLocationContext();
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
    removeLocation(id);
  };
  const handleSelect = (coordinate: Omit<MapMarker, 'id'>) => handleFocusLocation(coordinate);

  return (
    <InfiniteScroll
      height={'90vh'}
      scrollableTarget="locationScrollableContiner"
      dataLength={locations.length}
      next={loadLocations}
      hasMore={!loading && hasMore}
      loader={
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      }
      endMessage={<p style={{ textAlign: 'center' }}>No more locations</p>}
    >
      <List>
        {locations.map((location, index) => (
          <ListItem key={`${location.googlePlaceId}-${index}`} data-testid="saved-location">
            <LocationCard location={location} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} />
          </ListItem>
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default SavedLocations;
