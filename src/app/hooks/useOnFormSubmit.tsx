import { LocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { createLocation, updateLocation } from '@/lib/data';
import { SubmitHandler } from 'react-hook-form';
import { ILocation } from '@/models/Location';
import { mapLocationFormDataToLocationSchema } from '@/models/mappers/mapLocationFormDataToLocationSchema';
import { usePathname, useRouter } from 'next/navigation';

export const useOnFormSubmit = (
  addLocation: (newLocation: ILocation) => void,
  editLocation: (updatedLocation: ILocation) => void,
  isEditMode: boolean,
) => {
  const { formState } = useLocationForm();
  const router = useRouter();
  const pathname = usePathname();

  const onSubmit: SubmitHandler<LocationFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      try {
        const locationData = mapLocationFormDataToLocationSchema(data);
        isEditMode ? editLocation(await updateLocation(locationData)) : addLocation(await createLocation(locationData));
        router.replace(pathname);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { onSubmit };
};
