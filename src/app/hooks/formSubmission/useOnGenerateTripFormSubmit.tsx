import { SubmitHandler } from 'react-hook-form';
import { GenerateTripFormData, useGenerateTripForm } from '@/app/hooks/useGenerateTripForm';
import { useGenerateTrip } from '@/app/hooks/query/useGenerateTrip';
import { useTripsSearchContext } from '@/app/providers/TripsSearchContextProvider/TripsSearchContextProvider';

export const useOnGenerateTripFormSubmit = (sideEffect: () => void) => {
  const { formState } = useGenerateTripForm();
  const { refetch } = useTripsSearchContext();
  const { generateTrip } = useGenerateTrip(refetch);

  const onSubmit: SubmitHandler<GenerateTripFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      generateTrip(data);
      sideEffect();
    }
  };
  return { onSubmit };
};
