import { useForm } from 'react-hook-form';

export interface LocationFormData {
  locationName: string;
  note: string;
  locationType: string;
  privacy: boolean;
  place: google.maps.places.PlaceResult | null;
}

export const useLocationForm = () => {
  return useForm<LocationFormData>({
    defaultValues: {
      locationName: '',
      locationType: 'general',
      privacy: false, // false for private, true for public
      note: '',
      place: null, // initialize the place
    },
  });
};
