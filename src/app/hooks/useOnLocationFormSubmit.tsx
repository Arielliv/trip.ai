import { defaultLocationFormData, LocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { SubmitHandler } from 'react-hook-form';
import { mapLocationFormDataToLocationSchema } from '@/models/mappers/mapLocationFormDataToLocationSchema';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export const useOnLocationFormSubmit = () => {
  const { formState, reset } = useLocationForm();
  const { editLocation, isEditMode, addLocation } = useLocationContext();
  const {} = useLocationContext();

  const onSubmit: SubmitHandler<LocationFormData> = async (data): Promise<void> => {
    if (Object.keys(formState.errors).length === 0) {
      const locationData = mapLocationFormDataToLocationSchema(data);
      isEditMode
        ? editLocation({ location: locationData, files: data.files })
        : addLocation({ location: locationData, files: data.files });
      reset(defaultLocationFormData);
    }
  };
  return { onSubmit };
};
