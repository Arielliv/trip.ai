import { SubmitHandler } from 'react-hook-form';
import { GenerateTripFormData, useGenerateTripForm } from '@/app/hooks/useGenerateTripForm';
import { useGenerateTrip } from '@/app/hooks/query/useGenerateTrip';

export const useOnGenerateTripFormSubmit = (sideEffect: () => void) => {
  const { formState } = useGenerateTripForm();
  const { generateTrip } = useGenerateTrip();

  const onSubmit: SubmitHandler<GenerateTripFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      generateTrip(data);
      sideEffect();
    }
  };
  return { onSubmit };
};
