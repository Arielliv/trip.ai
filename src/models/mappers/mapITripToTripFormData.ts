import { Visibility } from '@/models/constants';
import { ITrip, TripLocation } from '@/models/Trip';
import { LocationInTrip, TripFormData } from '@/app/hooks/useTripForm';

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

export const mapLocationInTripToLocationsFormData = (locationInTrip: TripLocation): LocationInTrip => {
  return {
    id: locationInTrip.location_id.toString() || '',
    duration: `${locationInTrip.duration.value} ${locationInTrip.duration.timeUnit}`,
    // @ts-ignore
    date: locationInTrip.dateRange,
    AdditionalInfo: locationInTrip?.additionalInfo,
    cost: locationInTrip?.cost,
  };
};
