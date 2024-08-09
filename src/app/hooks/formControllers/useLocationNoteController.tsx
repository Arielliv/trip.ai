import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/forms/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationNoteController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, LocationFormFieldPath.Note>({
    name: LocationFormFieldPath.Note,
  });

  return { field, error };
};
