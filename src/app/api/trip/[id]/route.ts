import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ILocationInTrip, ITrip } from '@/models/Trip';
import { mapTripToFullTrip } from '@/models/mappers/mapTripToFullTrip';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import { authAndGetUserId, saveLocationInUser } from '@/src/server/utils';
import { validateName, validateNonNullArguments, validatePermissions } from '@/src/server/validators';
import { LocationPermissionEnum, OperationType, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { createNextErrorResponse } from '@/src/server/error';
import User from '@/models/IUser';
import { IUserPermission } from '@/models/shared/types';
import Location, { ILocationDto } from '@/models/Location';
import { ObjectId } from 'mongodb';
import { LocationType } from '@/models/constants';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const userId = await authAndGetUserId();
    const trip = await Trip.findById(params.id).populate({
      path: 'locations.location_id',
      model: 'Location',
    });
    validatePermissions(userId, trip?.permissions, TripPermissionEnum.ViewBasic, OperationType.GET);
    return NextResponse.json(mapTripToFullTrip(trip, userId) as ITrip);
  } catch (error) {
    return createNextErrorResponse(error);
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const userId = await authAndGetUserId();

    const trip: ITrip = await req.json();
    validateName(trip?.name);
    validatePermissions(userId, trip?.permissions, TripPermissionEnum.EditBasic, OperationType.UPDATE);

    const oldLocations = trip?.locations;
    const tripToSave = await buildTripToSave(trip, userId, true);

    const updatedTrip: ITrip | null = await Trip.findOneAndUpdate(
      { _id: params.id, owner_id: userId },
      { $set: tripToSave },
      { new: true },
    );
    await updateTripDataInOtherDocuments(
      updatedTrip?.locations,
      oldLocations,
      updatedTrip?.permissions,
      new ObjectId(updatedTrip?._id),
    );

    NextResponse.json(
      {
        trip: updatedTrip,
        message: 'Trip updated successfully',
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error('Failed to update trip:', error);
    return createNextErrorResponse(error);
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = await authAndGetUserId();
    const trip = await Trip.findById(params.id);
    validatePermissions(userId, trip?.permissions, TripPermissionEnum.Admin, OperationType.DELETE);
    await Trip.findByIdAndDelete(trip._id);
    await User.updateMany({ Trips: trip._id }, { $pull: { Trips: trip._id } });
    return NextResponse.json({ message: `Trip ${params.id} has been deleted` });
  } catch (error) {
    return createNextErrorResponse(error);
  }
}

const updateTripDataInOtherDocuments = async (
  currentTripLocations: ILocationInTrip[] | undefined,
  oldTripLocations: ILocationInTrip[] | undefined,
  tripPermissions: IUserPermission[] | undefined,
  tripId: ObjectId | null,
) => {
  validateNonNullArguments([currentTripLocations, oldTripLocations, tripPermissions, tripId]);
  const currentLocationIds = currentTripLocations?.map(extractLocationIdFromTripLocations);
  const oldTripLocationIds = oldTripLocations?.map(extractLocationIdFromTripLocations);
  const locationsToAdd = getLocationsDelta(currentLocationIds, oldTripLocationIds);
  const locationsToRemove = getLocationsDelta(oldTripLocationIds, currentLocationIds);
  await updateLocationsTripsArray(locationsToAdd, locationsToRemove, tripId);
  await updateLocationsPermissions(locationsToAdd, tripPermissions);
};

const getLocationsDelta = (
  locationArray: ObjectId[] | undefined,
  deltaVerifier: ObjectId[] | undefined,
): ObjectId[] => {
  let locationsDelta: ObjectId[] = [];
  locationArray?.forEach((currenLocation: ObjectId) => {
    if (!deltaVerifier?.includes(currenLocation)) {
      locationsDelta.push(currenLocation);
    }
  });
  return locationsDelta;
};

const updateLocationsTripsArray = async (
  locationsToAdd: ObjectId[],
  locationsToRemove: ObjectId[],
  tripId: ObjectId | null,
) => {
  if (locationsToAdd.length > 0) {
    await Location.updateMany({ _id: { $in: locationsToAdd } }, { $addToSet: { trips: tripId } });
  }
  if (locationsToRemove.length > 0) {
    await Location.updateMany({ _id: { $in: locationsToRemove } }, { $pull: { trips: tripId } });
  }
};

const extractLocationIdFromTripLocations = (locationInTrip: ILocationInTrip) => {
  if (typeof locationInTrip.location_id === 'string') {
    return new ObjectId(locationInTrip.location_id);
  } else if (typeof locationInTrip.location_id === 'object' && locationInTrip.location_id._id) {
    return new ObjectId(locationInTrip.location_id._id);
  } else {
    throw new Error('Invalid location type');
  }
};

const updateLocationsPermissions = async (
  locationsToAdd: ObjectId[],
  tripPermissions: IUserPermission[] | undefined,
) => {
  if (tripPermissions) {
    for (const tripPermission of tripPermissions) {
      await updateLocationAndUserByTripPermission(tripPermission, locationsToAdd);
    }
  }
};

const getLocationPermissionByTripPermission = (
  userPermissionOnTrip: IUserPermission,
  locationType: LocationType | undefined,
): LocationPermissionEnum | undefined => {
  let permissionType = undefined;
  if (userPermissionOnTrip.permissionType <= TripPermissionEnum.EditBasic) {
    permissionType = LocationPermissionEnum.edit;
  } else if (userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewFullTrip) {
    permissionType = LocationPermissionEnum.view;
  } else if (
    (userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewHotels && locationType === LocationType.Hotel) ||
    locationType === LocationType.General
  ) {
    permissionType = LocationPermissionEnum.view;
  } else if (
    userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewBasic &&
    locationType !== LocationType.Hotel &&
    locationType !== LocationType.Restaurant
  ) {
    permissionType = LocationPermissionEnum.view;
  }
  if (!permissionType) return undefined;
  return permissionType;
};

const updateLocationAndUserByTripPermission = async (
  userPermissionOnTrip: IUserPermission,
  locationToAdd: ObjectId[],
) => {
  const user = await User.findById(userPermissionOnTrip.userId);
  for (const location of locationToAdd) {
    const locationFromDb: ILocationDto | null = await Location.findById(location._id);
    if (!locationFromDb) {
      throw Error('Location was not found in db will trying to update');
    }
    const userPermissionOnLocationIndex = locationFromDb.permissions.findIndex(
      (permission) => permission.userId === userPermissionOnTrip.userId,
    );
    let permissionTypeToSave;
    if (userPermissionOnLocationIndex === -1) {
      permissionTypeToSave = getLocationPermissionByTripPermission(userPermissionOnTrip, locationFromDb.type);
      if (permissionTypeToSave) {
        if (locationFromDb.permissions) {
          locationFromDb.permissions.push({
            userId: userPermissionOnTrip.userId,
            permissionType: permissionTypeToSave,
          });
        } else {
          locationFromDb.permissions = [{ userId: userPermissionOnTrip.userId, permissionType: permissionTypeToSave }];
        }
        await locationFromDb.save();
        await saveLocationInUser(user, locationFromDb);
      }
    } else {
      permissionTypeToSave = getLocationPermissionByTripPermission(userPermissionOnTrip, locationFromDb.type);
      if (permissionTypeToSave) {
        locationFromDb.permissions[userPermissionOnLocationIndex].permissionType = permissionTypeToSave;
        await locationFromDb.save();
        await saveLocationInUser(user, locationFromDb);
      }
    }
  }
};
