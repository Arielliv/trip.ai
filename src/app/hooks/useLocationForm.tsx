import { useForm } from 'react-hook-form';
import { LocationFormData } from '@/app/components/LocationForm/LocationForm';

export const useLocationForm = () => {
  return useForm<LocationFormData>({
    defaultValues: {
      locationName: '',
      locationType: 'general',
      privacy: false, // false for private, true for public
      note: '',
    },
  });
};
