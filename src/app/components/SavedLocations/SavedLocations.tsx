'use client';
import React, { ReactEventHandler, ReactNode, useCallback, useEffect, useState } from 'react';
import { CircularProgress, List, ListItem, Box, SelectChangeEvent } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LocationCard } from '@/app/components/LocationCard/LocationCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MapMarker } from '@/app/components/Map/Map';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { SelectTrip } from '@/app/components/SelectTrip/SelectTrip';
import { useSelectTrip } from '@/app/hooks/useSelectTrip';

export interface SavedLocationsProps {
  setSelectedTab: (tab: string) => void;
}

const SavedLocations = ({ setSelectedTab }: SavedLocationsProps) => {
  const { locations, fetchNextPage, isLoading, hasNextPage, handleFocusLocation, removeLocation } =
    useLocationContext();
  const { loadLocationsByTripId } = useSelectTrip();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectTerm, setSelectTerm] = useState('');
  const [hasSelectTermBeenSet, setHasSelectTermBeenSet] = useState(false);

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

    return removeLocation(id);
  };

  const handleSelect = (coordinate: Omit<MapMarker, 'id'>) => handleFocusLocation(coordinate);

  const handleSelectTripChange = async (event: SelectChangeEvent) => {
    const selectedTripId = event.target.value;
    router.push(selectedTripId === 'None' ? '/locations' : '/locations?' + createQueryString('tripId', selectedTripId));
    setSelectTerm(selectedTripId);
    if (!hasSelectTermBeenSet) {
      setHasSelectTermBeenSet(true);
    }
  };

  useEffect(() => {
    if (hasSelectTermBeenSet) {
      void loadLocationsByTripId(selectTerm);
    }
  }, [selectTerm]);

  const handleDefaultValue = (): string => {
    const selectedTripId = searchParams?.get('tripId');
    if (selectedTripId) {
      return selectedTripId;
    } else {
      return 'None';
    }
  };

  const handleRenderValue = (value: any): string => {
    void loadLocationsByTripId(value === 'None' ? null : value);
    return value;
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <SelectTrip
        onSelectChange={handleSelectTripChange}
        defaultSelectValue={handleDefaultValue}
        renderSelectValue={handleRenderValue}
      />
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
    </Box>
  );
};

export default SavedLocations;
