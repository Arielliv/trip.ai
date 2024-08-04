import { useMutation } from '@tanstack/react-query';
import { generateTrip } from '@/lib/operations/tripOperations';
import { useSnackbar } from 'notistack';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';
import { useNavigateToTripByTripId } from '@/app/hooks/useNavigateToTripByTripId';

export const useGenerateTrip = () => {
  const { navigateToTripeByTripId } = useNavigateToTripByTripId();
  const { enqueueSnackbar } = useSnackbar();
  const generateTripMutation = useMutation({
    mutationFn: generateTrip,
    onSuccess: (data) => {
      const message = 'Trip generated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
      navigateToTripeByTripId(data._id);
    },
    onError: (error) => {
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
