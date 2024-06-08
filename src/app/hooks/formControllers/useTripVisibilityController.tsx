import { useController } from 'react-hook-form';
import { TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';
import { TripFormData } from '@/app/hooks/useTripForm';

export const useTripVisibilityController = () => {
  const {
    field,
    fieldState: { error },
  } = useController<TripFormData, TripFormFieldPath.Visibility>({
    name: TripFormFieldPath.Visibility,
  });

  return { field, error };
};
