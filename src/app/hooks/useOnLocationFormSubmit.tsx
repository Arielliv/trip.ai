import { LocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { SubmitHandler } from 'react-hook-form';
import { ILocation } from '@/models/Location';
import { mapLocationFormDataToLocationSchema } from '@/models/mappers/mapLocationFormDataToLocationSchema';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { createLocation, updateLocation } from '@/lib/operations/locationOperations';

export const useOnLocationFormSubmit = ({
  editLocation,
  isEditMode,
  addLocation,
}: {
  editLocation: (updatedLocation: ILocation) => void;
  isEditMode: boolean;
  addLocation: (newLocation: ILocation) => void;
}) => {
  const { formState } = useLocationForm();
  const {} = useLocationContext();

  const onSubmit: SubmitHandler<LocationFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      const locationData = mapLocationFormDataToLocationSchema(data);
      isEditMode ? editLocation(await updateLocation(locationData)) : addLocation(await createLocation(locationData));
    }
  };
  return { onSubmit };
};
