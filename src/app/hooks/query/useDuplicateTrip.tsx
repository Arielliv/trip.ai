import { RefetchOptions, useMutation } from '@tanstack/react-query';
import { duplicateTrip } from '@/lib/operations/tripOperations';
import { useState } from 'react';
import { useSnackbarWithMultipleLoaders } from '@/app/hooks/useSnackbarWithLoader';

export const useDuplicateTrip = (refetch: (options?: RefetchOptions) => Promise<any>) => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const { showSnackbarWithLoader, closeSnackbarById, enqueueSnackbar } = useSnackbarWithMultipleLoaders();

  const duplicateTripMutation = useMutation({
    mutationFn: (tripId: string) => {
      showSnackbarWithLoader('DuplicateTrip', 'Duplicating trip');
      return duplicateTrip(tripId);
    },
    onSuccess: () => {
      closeSnackbarById('DuplicateTrip');
      const message = 'Trip duplicated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      return refetch();
    },
    onError: (error) => {
      closeSnackbarById('DuplicateTrip');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
    onSettled: () => {
      closeSnackbarById('DuplicateTrip');
      setIsDuplicating(false);
    },
  });

  const cloneTrip = (tripId: string) => {
    setIsDuplicating(true);
    duplicateTripMutation.mutate(tripId);
  };

  return { duplicateTrip: cloneTrip, isDuplicating };
};
