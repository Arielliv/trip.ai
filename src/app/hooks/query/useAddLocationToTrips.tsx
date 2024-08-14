import { useMutation } from '@tanstack/react-query';
import { addLocationToTrips } from '@/lib/operations/tripOperations';
import { ILocationInTrip } from '@/models/Trip';
import { useSnackbarWithMultipleLoaders } from '@/app/hooks/useSnackbarWithLoader';

export const useAddLocationToTrips = () => {
  const { showSnackbarWithLoader, closeSnackbarById, enqueueSnackbar } = useSnackbarWithMultipleLoaders();

  const addLocationToTripsMutation = useMutation({
    mutationFn: (addLocationToTripObject: { location: ILocationInTrip; tripIds: string[] }) => {
      showSnackbarWithLoader('addLocationToSelectedTrips', 'adding location to selected trips');
      return addLocationToTrips(addLocationToTripObject);
    },
    onSuccess: (_data) => {
      closeSnackbarById('addLocationToSelectedTrips');
      const message = 'Location was added to selected trips successfully!';
      enqueueSnackbar(message, { variant: 'success' });
    },
    onError: (error) => {
      closeSnackbarById('addLocationToSelectedTrips');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const addLocationToTripsHandler = (addLocationToTripObject: { location: ILocationInTrip; tripIds: string[] }) => {
    addLocationToTripsMutation.mutate(addLocationToTripObject);
  };

  return {
    addLocationToTrips: addLocationToTripsHandler,
  };
};
