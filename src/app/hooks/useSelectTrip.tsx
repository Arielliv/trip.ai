import { useCallback, useState } from 'react';
import { useInfiniteSearchedTrips } from '@/app/hooks/query/useInfiniteSearchedTrips';
import { ITrip } from '@/models/Trip';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { TripsPaginationResponse } from '@/lib/types';
import debounce from 'lodash/debounce';
import { useInfiniteLocations } from '@/app/hooks/query/useInfiniteLocations';

export const useSelectTrip = (limit = 10) => {
  const [tripId, setTripId] = useState<string>();
  const { refetch } = useInfiniteLocations(tripId, limit);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadLocations = useCallback(
    debounce(() => {
      return refetch();
    }, 300),
    [],
  );

  const loadLocationsByTripId = useCallback(
    (value?: string) => {
      setTripId(value);
      debouncedLoadLocations();
      return refetch();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch],
  );

  return {
    loadLocationsByTripId,
    setTripId,
  };
};
