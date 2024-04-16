import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { FormFieldPath } from '@/app/components/constants/formFieldPath';

export const useLocationTypeController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, FormFieldPath.LocationType>({
    name: FormFieldPath.LocationType,
  });

  return { field, error };
};
