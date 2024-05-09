import { useForm } from 'react-hook-form';

export interface TripFormData {
  _id: string;
  tripName: string;
  privacy: boolean;
  //todo add more fields
}
export const defaultTripFormData = {
  locationName: '',
  privacy: false, // false for private, true for public
};

export const useTripForm = (editableTrip?: TripFormData) => {
  return useForm<TripFormData>({
    defaultValues: editableTrip ? editableTrip : defaultTripFormData,
  });
};
