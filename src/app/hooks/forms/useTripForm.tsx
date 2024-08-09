import { useForm } from 'react-hook-form';
import { DateRange } from '@mui/x-date-pickers-pro';
import { ILocation } from '@/models/Location';
import { IUserPermission } from '@/models/shared/types';

export interface LocationInTripFormData {
  id: string;
  location_id?: string;
  connectedLocationData?: ILocation;
  duration: string;
  date: DateRange<Date>;
  additionalInfo: string;
  cost: number;
}
export interface TripFormData {
  _id: string;
  tripName: string;
  visibility: boolean;
  locations: LocationInTripFormData[];
  permissions: IUserPermission[];
  //todo add more fields
}
export const defaultTripFormData = {
  tripName: '',
  privacy: false, // false for private, true for public
};

export const useTripForm = (editableTrip?: TripFormData) => {
  return useForm<TripFormData>({
    defaultValues: editableTrip ? editableTrip : defaultTripFormData,
  });
};
