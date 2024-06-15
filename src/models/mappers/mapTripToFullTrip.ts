import { ILocationInTrip, ITrip } from '@/models/Trip';
import { ILocation } from '@/models/Location';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/useTripForm';
import { LocationType, Visibility } from '@/models/constants';
import { TripPermissionEnum } from '@/models/enums/permissionsEnums';

export const mapFullTripToTripFormData = (trip: ITrip | undefined): TripFormData | undefined => {
  if (!trip) {
    return;
  }
  const locations = trip.locations.map(mapFullLocationInTripToLocationsFormData);
  return {
    _id: trip._id || '',
    tripName: trip.name,
    locations: locations ? locations : [],
    visibility: trip.visibility === Visibility.Public,
    permissions: trip.permissions,
  };
};

export const mapFullLocationInTripToLocationsFormData = (locationInTrip: ILocationInTrip): LocationInTripFormData => {
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

export function mapTripToFullTrip(trip: ITrip, userId: string): ITrip {
  const userPermission = trip.permissions?.find((permission) => permission.userId.toString() === userId);
  const filteredLocation = trip.locations.filter((location) => {
    const locationData = location.location_id as ILocation;
    if (userPermission) {
      if (userPermission?.permissionType <= TripPermissionEnum.ViewFullTrip) {
        return location;
      } else if (
        userPermission?.permissionType <= TripPermissionEnum.ViewHotels &&
        (locationData.type === LocationType.Hotel || locationData.type === LocationType.General)
      ) {
        return location;
      } else if (
        userPermission?.permissionType <= TripPermissionEnum.ViewBasic &&
        locationData.type === LocationType.General
      ) {
        return location;
      }
    }
  });

  return {
    _id: trip._id,
    name: trip.name,
    participants_ids: trip.participants_ids,
    permissions: trip.permissions,
    visibility: trip.visibility,
    transportations: trip.transportations,
    reviews: trip.reviews,
    locations: filteredLocation.map((location) => ({
      connectedLocationData: location.location_id as ILocation, // Cast location_id as ILocation assuming it's populated
      id: location.id,
      dateRange: location.dateRange,
      duration: location.duration || { value: 0, timeUnit: 'days' },
      additionalInfo: location.additionalInfo || '',
      cost: location.cost || 0,
    })),
  };
}
