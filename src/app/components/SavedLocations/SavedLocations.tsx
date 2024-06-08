'use client';
import React from 'react';
import { CircularProgress, List, ListItem, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LocationCard } from '@/app/components/LocationCard/LocationCard';
import { MapMarker } from '@/app/components/Map/Map';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { SelectTripInSavedLocations } from '@/app/components/SelectTripInSavedLocations/SelectTripInSavedLocations';

export interface SavedLocationsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedLocations = ({ setSelectedTab }: SavedLocationsProps) => {
  const { locations, fetchNextPage, isLoading, hasNextPage, handleFocusLocation, removeLocation, setLocationId } =
    useLocationContext();

  const handleEdit = (id: string, coordinate: Omit<MapMarker, 'id'>) => {
    setLocationId(id);
    setSelectedTab('0');
    handleFocusLocation(coordinate);
  };

  const handleDelete = (id: string) => {
    return removeLocation(id);
  };

  const handleSelect = (coordinate: Omit<MapMarker, 'id'>) => handleFocusLocation(coordinate);

  return (
    <>
      <SelectTripInSavedLocations />
      <InfiniteScroll
        height={'90vh'}
        scrollableTarget="locationScrollableContiner"
        dataLength={locations.length}
        next={() => fetchNextPage!()}
        hasMore={!isLoading && hasNextPage}
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
    </>
  );
};

export default SavedLocations;
