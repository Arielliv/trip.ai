import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ILocation } from '@/models/Location';
import { createLocation, deleteLocation, updateLocation } from '@/lib/operations/locationOperations';
import { useInfiniteLocations } from '@/app/hooks/query/useInfiniteLocations';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { LocationsPaginationResponse } from '@/lib/types';

export interface LocationsManagerContextObject {
  locations: ILocation[];
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<LocationsPaginationResponse, unknown>, Error>>;
  addLocation: (newLocation: ILocation) => void;
  editLocation: (updatedLocation: ILocation) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  removeLocation: (id: string) => void;
  loadLocationsByTripId: (id?: string) => void;
}

export const useManageLocations = (limit = 10) => {
  const queryClient = useQueryClient();
  const [tripId, setTripId] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, fetchNextPage, hasNextPage, isLoading } = useInfiniteLocations(tripId, limit);

  const locations = useMemo(() => {
    return data?.pages.flatMap((page) => page.locations) || [];
  }, [data]);

  const addLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      const message = 'Location created successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const editLocationMutation = useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      const message = 'Location updated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const removeLocationMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      const message = 'Location removed successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const addLocation = (newLocation: ILocation) => {
    addLocationMutation.mutate(newLocation);
  };

  const editLocation = (updatedLocation: ILocation) => {
    editLocationMutation.mutate(updatedLocation);
  };

  const removeLocation = (id: string) => {
    removeLocationMutation.mutate(id);
  };

  const loadLocations = useCallback((value?: string) => {
    setTripId(value);
  }, []);

  const getLocationById = useCallback(
    (id: string | null): ILocation | undefined => {
      if (!id) return;
      return locations.find((location) => location._id === id);
    },
    [locations],
  );

  return {
    locations,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error: error ? error.message : null,
    getLocationById,
    addLocation,
    removeLocation,
    loadLocationsByTripId: loadLocations,
    editLocation,
  };
};
