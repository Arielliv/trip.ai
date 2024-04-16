import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { FormFieldPath } from '@/app/components/constants/formFieldPath';

export const useLocationPrivacyController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, FormFieldPath.Privacy>({
    name: FormFieldPath.Privacy,
  });

  return { field, error };
};
