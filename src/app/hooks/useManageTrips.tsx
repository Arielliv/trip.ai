import { deleteTrip, createTrip, updateTrip } from '@/lib/operations/tripOperations';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ITrip } from '@/models/Trip';
import { useState } from 'react';
import { useInfiniteTrips } from '@/app/hooks/query/useInfiniteTrips';
import { TripsPaginationResponse } from '@/lib/types';
import { useSnackbar } from 'notistack';

export interface TripsManagerContextObject {
  trips: ITrip[];
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<TripsPaginationResponse, unknown>, Error>>;
  addTrip: (newTrip: ITrip) => void;
  editTrip: (updatedTrip: ITrip) => void;
  isEditMode: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
  removeTrip: (id: string) => void;
  currentTripId: string | undefined;
}

export const useManageTrips = (limit = 10): TripsManagerContextObject => {
  const [currentTripId, setCurrentTripId] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteTrips(limit);

  const trips = data?.pages.flatMap((page) => page.trips) || [];

  const addTripMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (newTrip) => {
      const message = 'Trip updated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      setCurrentTripId(newTrip._id); // Assuming newTrip contains the _id after creation
      return queryClient.invalidateQueries({ queryKey: ['trips', limit] });
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const editTripMutation = useMutation({
    mutationFn: updateTrip,
    onSuccess: () => {
      const message = 'Trip updated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return queryClient.invalidateQueries({ queryKey: ['trips', limit] });
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const removeTripMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['trips', limit] });
    },
  });

  const addTrip = (newTrip: ITrip) => {
    addTripMutation.mutate(newTrip);
  };

  const editTrip = (updatedTrip: ITrip) => {
    editTripMutation.mutate(updatedTrip);
  };

  const removeTrip = (id: string) => {
    removeTripMutation.mutate(id);
  };

  return {
    trips,
    fetchNextPage,
    addTrip,
    editTrip,
    removeTrip,
    currentTripId,
    isEditMode: !!currentTripId,
    isLoading,
    hasNextPage,
  };
};
