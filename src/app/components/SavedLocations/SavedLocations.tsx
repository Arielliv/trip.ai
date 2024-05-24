'use client';
import React, { useCallback } from 'react';
import { CircularProgress, List, ListItem, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LocationCard } from '@/app/components/LocationCard/LocationCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MapMarker } from '@/app/components/Map/Map';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

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
    return removeLocation(id);
  };

  const handleSelect = (coordinate: Omit<MapMarker, 'id'>) => handleFocusLocation(coordinate);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Trip</InputLabel>
        <Select label="Trip" defaultValue="None" fullWidth>
          <MenuItem value="None">None</MenuItem>
        </Select>
      </FormControl>
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
    </Box>
  );
};

export default SavedLocations;
