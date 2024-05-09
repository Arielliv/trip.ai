import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const usePlaceController = () => {
  const {
    field: { value, onChange, ref },
    fieldState: { error, isDirty },
  } = useController<LocationFormData, LocationFormFieldPath.Place>({
    name: LocationFormFieldPath.Place,
    rules: { required: 'Must include place for new location' },
  });

  return { value, onChange, error, ref, isDirty };
};
