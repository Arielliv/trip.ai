import { useForm } from 'react-hook-form';
import { DateRange } from '@mui/x-date-pickers-pro';

export interface LocationInTrip {
  id: string;
  duration: string;
  date: DateRange<Date>;
  AdditionalInfo: string;
  cost: number;
}
export interface TripFormData {
  _id: string;
  tripName: string;
  privacy: boolean;
  locations: LocationInTrip[];
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
