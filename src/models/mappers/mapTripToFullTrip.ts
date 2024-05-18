import { IFullLocationInTrip, IFullTrip, ITrip } from '@/models/Trip';
import { ILocation } from '@/models/Location';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/useTripForm';
import { Visibility } from '@/models/constants';

export const mapIFullTripToTripFormData = (trip: IFullTrip | undefined): TripFormData | undefined => {
  if (!trip) {
    return;
  }
  const locations = trip.locations.map(mapFullLocationInTripToLocationsFormData);
  return {
    _id: trip._id || '',
    tripName: trip.name,
    locations: locations ? locations : [],
    privacy: trip.visibility === Visibility.Public,
  };
};

export const mapFullLocationInTripToLocationsFormData = (
  locationInTrip: IFullLocationInTrip,
): LocationInTripFormData => {
  return {
    id: locationInTrip.id ?? '',
    connectedLocationData: locationInTrip.connectedLocationData,
    duration: `${locationInTrip.duration?.value} ${locationInTrip.duration?.timeUnit}` ?? '',
    // @ts-ignore
    date: locationInTrip.dateRange.map((date) => new Date(date)) ?? [],
    additionalInfo: locationInTrip?.additionalInfo ?? '',
    cost: locationInTrip?.cost ?? 0,
  };
};

export function mapTripToFullTrip(trip: ITrip): IFullTrip {
  return {
    _id: trip._id,
    name: trip.name,
    participants_ids: trip.participants_ids,
    permissions: trip.permissions,
    visibility: trip.visibility,
    transportations: trip.transportations,
    reviews: trip.reviews,
    locations: trip.locations.map((location) => ({
      connectedLocationData: location.location_id as ILocation, // Cast location_id as ILocation assuming it's populated
      id: location.id,
      dateRange: location.dateRange,
      duration: location.duration || { value: 0, timeUnit: 'days' },
      additionalInfo: location.additionalInfo || '',
      cost: location.cost || 0,
    })),
  };
}
