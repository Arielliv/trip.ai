import { useForm } from 'react-hook-form';

export interface LocationFormData {
  _id: string;
  locationName: string;
  note: string;
  locationType: string;
  place: google.maps.places.PlaceResult | null;
}
export const defaultLocationFormData = {
  locationName: '',
  locationType: 'general',
  note: '',
  place: null, // initialize the place
};

export const useLocationForm = (editableLocation?: LocationFormData) => {
  return useForm<LocationFormData>({
    defaultValues: editableLocation ? editableLocation : defaultLocationFormData,
  });
};
