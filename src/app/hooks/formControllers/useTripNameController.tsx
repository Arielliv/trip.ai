import { useController } from 'react-hook-form';

import { LocationFormData } from '@/app/hooks/useLocationForm';
import { LocationFormFieldPath, TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';
import { TripFormData } from '@/app/hooks/useTripForm';

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
