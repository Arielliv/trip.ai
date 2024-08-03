import { useController } from 'react-hook-form';
import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationFileController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, LocationFormFieldPath.Files>({
    name: LocationFormFieldPath.Files,
  });

  return { field, error };
};
