'use client';
import React from 'react';
import { CircularProgress, List, ListItem, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocationContext } from '@/app/providers/LocationDataProvider/LocationDataContext';
import { LocationCard } from '@/app/components/LocationCard';
import { MapMarker } from '@/app/components/Map/Map';

const SavedLocations = () => {
  const { locations, loadLocations, loading, hasMore, handleFocusLocation } = useLocationContext();

  const handleEdit = () => console.log('Edit action');
  const handleDelete = () => console.log('Edit action');
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
