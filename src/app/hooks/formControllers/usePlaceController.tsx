import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { FormFieldPath } from '@/app/components/constants/formFieldPath';

export const usePlaceController = () => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController<LocationFormData, FormFieldPath.Place>({
    name: FormFieldPath.Place,
    rules: { required: 'Must include place for new location' },
  });

  return { value, onChange, error, ref };
};
