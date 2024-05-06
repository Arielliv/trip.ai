import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationTypeController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, LocationFormFieldPath.LocationType>({
    name: LocationFormFieldPath.LocationType,
  });

  return { field, error };
};
