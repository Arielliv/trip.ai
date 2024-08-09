import { useController } from 'react-hook-form';

import { TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';
import { TripFormData } from '@/app/hooks/forms/useTripForm';

export const useTripNameController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<TripFormData, TripFormFieldPath.TripName>({
    name: TripFormFieldPath.TripName,
    rules: { required: 'Must include name for new trip' },
  });

  return { field, error };
};
