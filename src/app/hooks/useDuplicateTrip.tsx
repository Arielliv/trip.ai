import { RefetchOptions, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { duplicateTrip } from '@/lib/operations/tripOperations';
import { useState } from 'react';

export const useDuplicateTrip = (refetch: (options?: RefetchOptions) => Promise<any>) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isDuplicating, setIsDuplicating] = useState(false);

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
    onSettled: () => {
      setIsDuplicating(false);
    },
  });

  const cloneTrip = (tripId: string) => {
    setIsDuplicating(true);
    duplicateTripMutation.mutate(tripId);
  };

  return { duplicateTrip: cloneTrip, isDuplicating };
};
