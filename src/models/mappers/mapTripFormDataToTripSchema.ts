import { ILocation } from '@/models/Location';
import { LocationType, Visibility } from '@/models/constants';
import { LocationFormData } from '@/app/hooks/useLocationForm';
import { TripFormData } from '@/app/hooks/useTripForm';
import { ITrip } from '@/models/Trip';

export const mapTripFormDataToTripSchema = (tripFormData: TripFormData): ITrip => {
  return {
    _id: tripFormData._id,
    name: tripFormData.tripName,
    visibility: tripFormData.privacy ? Visibility.Public : Visibility.Private,
    locations: [],
    locations_order: [],
    participants_ids: [],
    permissions: [],
    transportations: [],
    reviews: [],
  };
};
