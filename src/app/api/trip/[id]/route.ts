import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ILocationInTrip, ITrip } from '@/models/Trip';
import { mapTripToFullTrip } from '@/models/mappers/mapTripToFullTrip';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import {
  authAndGetUserId,
  saveTripIdInManyUsers,
  updateLocationsPermissions,
  updateLocationsTripsArray,
} from '@/src/server/utils';
import { validateName, validateNonNullArguments, validatePermissions } from '@/src/server/validators';
import { OperationType, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { createNextErrorResponse } from '@/src/server/error';
import User from '@/models/IUser';
import { IUserPermission } from '@/models/shared/types';
import { ObjectId } from 'mongodb';

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

    const oldLocations = await Trip.findById<ITrip>(params.id);
    const tripToSave = await buildTripToSave(trip, userId, true);

    const updatedTrip: ITrip | null = await Trip.findOneAndUpdate(
      { _id: params.id, owner_id: userId },
      { $set: tripToSave },
      { new: true },
    );
    await updateTripDataInOtherDocuments(
      updatedTrip?.locations,
      oldLocations?.locations,
      updatedTrip?.permissions,
      new ObjectId(updatedTrip?._id),
    );

    return NextResponse.json(
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
  const allUserIdWithPermission = tripPermissions?.map((permission) => permission.userId);
  await updateLocationsTripsArray(locationsToAdd, locationsToRemove, tripId);
  await updateLocationsPermissions(locationsToAdd, tripPermissions);
  await saveTripIdInManyUsers(allUserIdWithPermission, tripId?.toString());
};

const getLocationsDelta = (
  locationArray: ObjectId[] | undefined,
  deltaVerifier: ObjectId[] | undefined,
): ObjectId[] => {
  let locationsDelta: ObjectId[] = [];
  locationArray?.forEach((currenLocation: ObjectId) => {
    if (!deltaVerifier?.some((deltaVerifierObjectId) => deltaVerifierObjectId.equals(currenLocation))) {
      locationsDelta.push(currenLocation);
    }
  });
  return locationsDelta;
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
