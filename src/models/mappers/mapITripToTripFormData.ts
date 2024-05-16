import { Visibility } from '@/models/constants';
import { ILocationInTrip, ITrip } from '@/models/Trip';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/useTripForm';

export const mapITripToTripFormData = (trip: ITrip | undefined): TripFormData | undefined => {
  if (!trip) {
    return;
  }
  const locations = trip.locations.map(mapLocationInTripToLocationsFormData);
  return {
    _id: trip._id || '',
    tripName: trip.name,
    locations: locations ? locations : [],
    privacy: trip.visibility === Visibility.Public,
  };
};

export const mapLocationInTripToLocationsFormData = (locationInTrip: ILocationInTrip): LocationInTripFormData => {
  return {
    id: locationInTrip.id ?? '',
    duration: `${locationInTrip.duration?.value} ${locationInTrip.duration?.timeUnit}` ?? '',
    // @ts-ignore
    date: locationInTrip.dateRange,
    AdditionalInfo: locationInTrip?.additionalInfo ?? '',
    cost: locationInTrip?.cost ?? 0,
  };
};
