import { useMutation } from '@tanstack/react-query';
import { addLocationToTrips } from '@/lib/operations/tripOperations';
import { useSnackbar } from 'notistack';
import { ILocationInTrip } from '@/models/Trip';

export const useAddLocationToTrips = () => {
  const { enqueueSnackbar } = useSnackbar();
  const addLocationToTripsMutation = useMutation({
    mutationFn: addLocationToTrips,
    onSuccess: (data) => {
      const message = 'Location was added to selected trips successfully!';
      enqueueSnackbar(message, { variant: 'success' });
    },
    onError: (error) => {
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
