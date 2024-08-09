import { SubmitHandler } from 'react-hook-form';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { TripFormData, useTripForm } from '@/app/hooks/forms/useTripForm';
import { mapTripFormDataToTripSchema } from '@/models/mappers/mapTripFormDataToTripSchema';

export const useOnTripFormSubmit = () => {
  const { formState } = useTripForm();
  const { addTrip, isEditMode, editTrip, currentTripId } = useTripContext();

  const onSubmit: SubmitHandler<TripFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        const tripDate = mapTripFormDataToTripSchema(data);
        isEditMode || currentTripId
          ? editTrip({ ...tripDate, ...(!tripDate._id && { _id: currentTripId }) })
          : addTrip(tripDate);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
