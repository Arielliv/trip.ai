import { ILocationInTrip } from '@/models/Trip';
import { IUserPermission } from '@/models/shared/types';
import { ObjectId } from 'mongodb';
import { validateNonNullArguments } from '@/src/server/validators';
import { saveTripIdInManyUsers, updateLocationsPermissions, updateLocationsTripsArray } from '@/src/server/utils';

export const updateTripDataInOtherDocuments = async (
  updatedTripLocations: ILocationInTrip[] | undefined,
  oldTripLocations: ILocationInTrip[] | undefined,
  tripPermissions: IUserPermission[] | undefined,
  tripId: ObjectId | null,
) => {
  validateNonNullArguments([updatedTripLocations, oldTripLocations, tripPermissions, tripId]);
  const updatedTripLocationIds = updatedTripLocations?.map(getIdFromTripLocation);
  const oldTripLocationIds = oldTripLocations?.map(getIdFromTripLocation);
  const locationsIdsToAdd = getLocationsDelta(updatedTripLocationIds, oldTripLocationIds);
  const locationsIdsToRemove = getLocationsDelta(oldTripLocationIds, updatedTripLocationIds);
  const usersIdWithPermission = tripPermissions?.map((permission) => permission.userId);

  await updateLocationsTripsArray(locationsIdsToAdd, locationsIdsToRemove, tripId);
  await updateLocationsPermissions(locationsIdsToAdd, tripPermissions);
  await saveTripIdInManyUsers(usersIdWithPermission, tripId?.toString());
};

const getLocationsDelta = (
  currentLocationIds: ObjectId[] | undefined,
  updatedLocationsIds: ObjectId[] | undefined,
): ObjectId[] => {
  let locationsDelta: ObjectId[] = [];
  currentLocationIds?.forEach((currenLocationId: ObjectId) => {
    if (!updatedLocationsIds?.some((updatedLocationId) => updatedLocationId.equals(currenLocationId))) {
      locationsDelta.push(currenLocationId);
    }
  });
  return locationsDelta;
};

const getIdFromTripLocation = (locationInTrip: ILocationInTrip) => {
  if (typeof locationInTrip.location_id === 'string') {
    return new ObjectId(locationInTrip.location_id);
  } else if (typeof locationInTrip.location_id === 'object' && locationInTrip.location_id._id) {
    return new ObjectId(locationInTrip.location_id._id);
  } else {
    throw new Error('Invalid location type');
  }
};
