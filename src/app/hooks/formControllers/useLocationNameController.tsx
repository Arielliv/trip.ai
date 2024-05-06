import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationNameController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, LocationFormFieldPath.LocationName>({
    name: LocationFormFieldPath.LocationName,
    rules: { required: 'Must include name for new location' },
  });

  return { field, error };
};
