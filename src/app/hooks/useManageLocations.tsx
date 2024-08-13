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
import { useCallback, useMemo, useState } from 'react';
import { LocationsPaginationResponse } from '@/lib/types';
import { useSnackbarWithMultipleLoaders } from '@/app/hooks/useSnackbarWithLoader';

export interface LocationsManagerContextObject {
  locations: ILocation[];
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<LocationsPaginationResponse, unknown>, Error>>;
  addLocation: (newLocation: { location: ILocation; files?: File[] }) => void;
  editLocation: (updatedLocation: { location: ILocation; files?: File[] }) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  removeLocation: (id: string) => void;
  loadLocationsByTripId: (id?: string) => void;
}

export const useManageLocations = (limit = 10) => {
  const queryClient = useQueryClient();
  const [tripId, setTripId] = useState<string>();
  const { showSnackbarWithLoader, closeSnackbarById, enqueueSnackbar } = useSnackbarWithMultipleLoaders();

  const { data, error, fetchNextPage, hasNextPage, isLoading } = useInfiniteLocations(tripId, limit);

  const locations = useMemo(() => {
    return data?.pages.flatMap((page) => page.locations) || [];
  }, [data]);

  const addLocationMutation = useMutation({
    mutationFn: (newLocation: { location: ILocation; files?: File[] }) => {
      showSnackbarWithLoader('addLocation', 'Creating your location');
      return createLocation(newLocation);
    },
    onSuccess: () => {
      closeSnackbarById('addLocation');
      const message = 'Location created successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      closeSnackbarById('addLocation');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const editLocationMutation = useMutation({
    mutationFn: (updatedLocation: { location: ILocation; files?: File[] }) => {
      showSnackbarWithLoader('editLocation', 'Updating your location');
      return updateLocation(updatedLocation);
    },
    onSuccess: () => {
      closeSnackbarById('editLocation');
      const message = 'Location updated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      closeSnackbarById('editLocation');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const removeLocationMutation = useMutation({
    mutationFn: (id: string) => {
      showSnackbarWithLoader('removeLocation', 'Removing your location');
      return deleteLocation(id);
    },
    onSuccess: () => {
      closeSnackbarById('removeLocation');
      const message = 'Location removed successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['locations', limit] });
    },
    onError: (error) => {
      closeSnackbarById('removeLocation');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const addLocation = (newLocation: { location: ILocation; files?: File[] }) => {
    addLocationMutation.mutate(newLocation);
  };

  const editLocation = (updatedLocation: { location: ILocation; files?: File[] }) => {
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
