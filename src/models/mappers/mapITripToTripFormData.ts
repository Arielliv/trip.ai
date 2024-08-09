import { Visibility } from '@/models/constants';
import { ILocationInTrip, ITrip } from '@/models/Trip';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/forms/useTripForm';

export const mapITripToTripFormData = (trip: ITrip | undefined): TripFormData | undefined => {
  if (!trip) {
    return;
  }
  const locations = trip.locations.map(mapLocationInTripToLocationsFormData);
  return {
    _id: trip._id || '',
    tripName: trip.name,
    locations: locations ? locations : [],
    visibility: trip.visibility === Visibility.Public,
    permissions: trip.permissions,
  };
};

export const mapLocationInTripToLocationsFormData = (locationInTrip: ILocationInTrip): LocationInTripFormData => {
  return {
    id: locationInTrip.id ?? '',
    connectedLocationData: locationInTrip.connectedLocationData ?? undefined,
    duration: `${locationInTrip.duration?.value} ${locationInTrip.duration?.timeUnit}` ?? '',
    // @ts-ignore
    date: locationInTrip.dateRange.map((date) => new Date(date)) ?? [],
    AdditionalInfo: locationInTrip?.additionalInfo ?? '',
    cost: locationInTrip?.cost ?? 0,
    location_id: (locationInTrip.location_id as unknown as string) ?? '',
  };
};
