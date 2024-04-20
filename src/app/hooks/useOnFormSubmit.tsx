import { LocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { createLocation } from '@/lib/data';
import { SubmitHandler } from 'react-hook-form';
import { ILocation } from '@/models/Location';
import { mapLocationFormDataToLocationSchema } from '@/models/mappers/mapLocationFormDataToLocationSchema';

export const useOnFormSubmit = (addLocation: (newLocation: ILocation) => void) => {
  const { formState } = useLocationForm();

  const onSubmit: SubmitHandler<LocationFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        const newLocation = mapLocationFormDataToLocationSchema(data);
        const locationFromDB = await createLocation(newLocation);
        addLocation(locationFromDB);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
