import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { FormFieldPath } from '@/app/components/constants/formFieldPath';

export const useLocationNoteController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, FormFieldPath.Note>({
    name: FormFieldPath.Note,
  });

  return { field, error };
};
