import { Visibility } from '@/models/constants';
import { ITrip } from '@/models/Trip';
import { TripFormData } from '@/app/hooks/useTripForm';

export const mapITripToTripFormData = (trip: ITrip | undefined): TripFormData | undefined => {
  if (!trip) {
    return;
  }
  return {
    _id: trip._id || '',
    tripName: trip.name,
    privacy: trip.visibility === Visibility.Public,
  };
};
