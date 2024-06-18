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
import { TripFormData } from '@/app/hooks/useTripForm';
import { mapITripToTripFormData } from '@/models/mappers/mapITripToTripFormData';

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

export const useManageTrips = (
  reset?: (tripFormData?: TripFormData) => void,
  limit = 10,
): TripsManagerContextObject => {
  const [currentTripId, setCurrentTripId] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteTrips(limit);

  const trips = data?.pages.flatMap((page) => page.trips) || [];

  const addTripMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (newTrip) => {
      const message = 'Trip updated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      setCurrentTripId(newTrip._id); // Assuming newTrip contains the _id after creation
      queryClient.setQueryData(['trips', limit], (oldData: InfiniteData<TripsPaginationResponse, unknown>) => {
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            ...page,
            totalCount: page.totalCount + 1,
            limit: page.limit,
            trips: [newTrip, ...page.trips],
          })),
        };
      });
      if (reset) {
        reset(mapITripToTripFormData(newTrip));
      }

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
