import { LocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { LocationType } from '@/models/constants';
import { createLocation } from '@/lib/data';
import { SubmitHandler } from 'react-hook-form';
import { mapLocationFormDataToLocationSchema } from '@/models/mappers/mapGoogleDataToILocation';

export const mapStringTypeToEnumType = (type: string) => {
  switch (type) {
    case 'general':
      return LocationType.General;
    case 'hotel':
      return LocationType.Hotel;
    case 'restaurant':
      return LocationType.Restaurant;
    default:
      return LocationType.General;
  }
};

export const useOnFormSubmit = () => {
  const { formState } = useLocationForm();

  const onSubmit: SubmitHandler<LocationFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        await createLocation(mapLocationFormDataToLocationSchema(data));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
