import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationPrivacyController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<LocationFormData, LocationFormFieldPath.Privacy>({
    name: LocationFormFieldPath.Privacy,
  });

  return { field, error };
};
