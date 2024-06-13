import { useMutation } from '@tanstack/react-query';
import { generateTrip } from '@/lib/operations/tripOperations';
import { useSnackbar } from 'notistack';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';

export const useGenerateTrip = () => {
  const { enqueueSnackbar } = useSnackbar();
  const generateTripMutation = useMutation({
    mutationFn: generateTrip,
    onSuccess: () => {
      const message = 'Trip generated successfully!';
      enqueueSnackbar(message, { variant: 'success' });
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
