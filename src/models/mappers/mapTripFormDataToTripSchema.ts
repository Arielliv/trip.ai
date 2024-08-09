import { Visibility } from '@/models/constants';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/forms/useTripForm';
import { ITrip, ILocationInTrip } from '@/models/Trip';

export const mapTripFormDataToTripSchema = (tripFormData: TripFormData): ITrip => {
  return {
    _id: tripFormData._id,
    name: tripFormData.tripName,
    visibility: tripFormData.visibility ? Visibility.Public : Visibility.Private,
    locations: tripFormData.locations.map(mapLocationInTripDataToLocationInTripSchema),
    participants_ids: [],
    permissions: tripFormData.permissions,
    transportations: [],
    reviews: [],
  };
};

const mapLocationInTripDataToLocationInTripSchema = (locationInTrip: LocationInTripFormData): ILocationInTrip => {
  let parsedDuration;
  let durationParts;
  if (locationInTrip.duration) {
    if (locationInTrip.duration !== 'undefined undefined') {
      durationParts = locationInTrip.duration.match(/(\d+)\s*(\w+)/);
      if (!durationParts) throw new Error('Duration format is incorrect or missing');
    }

    parsedDuration = {
      value: parseInt(durationParts![1]),
      timeUnit: durationParts![2],
    };
  }

  return {
    ...(locationInTrip.connectedLocationData && { location_id: locationInTrip.connectedLocationData._id }),
    ...(locationInTrip.id && { id: locationInTrip.id }),
    ...(locationInTrip.date && { dateRange: locationInTrip.date.filter((date): date is Date => date !== null) }),
    ...(parsedDuration && { duration: parsedDuration }),
    ...(locationInTrip.additionalInfo && { additionalInfo: locationInTrip.additionalInfo }),
    ...(locationInTrip.cost && { cost: locationInTrip.cost }),
    ...(locationInTrip.location_id && { location_id: locationInTrip.location_id }),
  };
};
