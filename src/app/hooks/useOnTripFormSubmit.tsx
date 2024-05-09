import { useLocationForm } from '@/app/hooks/useLocationForm';
import { SubmitHandler } from 'react-hook-form';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { TripFormData } from '@/app/hooks/useTripForm';
import { mapTripFormDataToTripSchema } from '@/models/mappers/mapTripFormDataToTripSchema';
import { createTrip } from '@/lib/data';

export const useOnTripFormSubmit = () => {
  const { addTrip } = useTripContext();
  const { formState } = useLocationForm();

  const onSubmit: SubmitHandler<TripFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        const newTrip = mapTripFormDataToTripSchema(data);
        const tripFromDB = await createTrip(newTrip);
        addTrip(tripFromDB);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
