import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { FormFieldPath } from '@/app/components/constants/formFieldPath';

export const useLocationNameController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, FormFieldPath.LocationName>({
    name: FormFieldPath.LocationName,
    rules: { required: 'Must include name for new location' },
  });

  return { field, error };
};
