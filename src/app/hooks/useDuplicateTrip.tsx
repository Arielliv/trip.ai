import { RefetchOptions, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { duplicateTrip } from '@/lib/operations/tripOperations';

export const useDuplicateTrip = (refetch: (options?: RefetchOptions) => Promise<any>) => {
  const { enqueueSnackbar } = useSnackbar();

  const duplicateTripMutation = useMutation({
    mutationFn: duplicateTrip,
    onSuccess: () => {
      const message = 'Trip duplicated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return refetch();
    },
    onError: (error) => {
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const cloneTrip = (tripId: string) => {
    duplicateTripMutation.mutate(tripId);
  };

  return { duplicateTrip: cloneTrip };
};
