import { RefetchOptions, useMutation } from '@tanstack/react-query';
import { generateTrip } from '@/lib/operations/tripOperations';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';
import { useNavigateToTripByTripId } from '@/app/hooks/useNavigateToTripByTripId';
import { useSnackbarWithMultipleLoaders } from '@/app/hooks/useSnackbarWithLoader';

export const useGenerateTrip = (refetch: (options?: RefetchOptions) => Promise<any>) => {
  const { navigateToTripeByTripId } = useNavigateToTripByTripId();
  const { showSnackbarWithLoader, closeSnackbarById, enqueueSnackbar } = useSnackbarWithMultipleLoaders();

  const generateTripMutation = useMutation({
    mutationFn: (generateTripData: GenerateTripFormData) => {
      showSnackbarWithLoader('GenerateTrip', 'Generating your trip');
      return generateTrip(generateTripData);
    },
    onSuccess: (data) => {
      closeSnackbarById('GenerateTrip');
      const message = 'Trip generated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      navigateToTripeByTripId(data._id);
      return refetch();
    },
    onError: (error) => {
      closeSnackbarById('GenerateTrip');
      const message = error.message;
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const generateTripHandler = (generateTripData: GenerateTripFormData) => {
    generateTripMutation.mutate(generateTripData);
  };

  return {
    generateTrip: generateTripHandler,
  };
};
