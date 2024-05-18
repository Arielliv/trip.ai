import { SubmitHandler } from 'react-hook-form';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { TripFormData, useTripForm } from '@/app/hooks/useTripForm';
import { mapTripFormDataToTripSchema } from '@/models/mappers/mapTripFormDataToTripSchema';
import { createTrip, updateTrip } from '@/lib/data';

export const useOnTripFormSubmit = () => {
  const { formState } = useTripForm();
  const { addTrip, isEditMode, editTrip } = useTripContext();

  const onSubmit: SubmitHandler<TripFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        const tripDate = mapTripFormDataToTripSchema(data);
        isEditMode ? editTrip(await updateTrip(tripDate)) : addTrip(await createTrip(tripDate));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
