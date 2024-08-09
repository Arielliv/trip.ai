import { Control, useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/forms/useLocationForm';
import { LocationFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const usePlaceController = (control?: Control<LocationFormData>) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error, isDirty },
  } = useController<LocationFormData, LocationFormFieldPath.Place>({
    name: LocationFormFieldPath.Place,
    rules: { required: 'Must include place for new location' },
    control,
  });

  return { value, onChange, error, ref, isDirty };
};
