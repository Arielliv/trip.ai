import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ITrip } from '@/models/Trip';
import { mapTripToFullTrip } from '@/models/mappers/mapTripToFullTrip';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import { authAndGetUserId } from '@/src/server/utils';
import { validateName, validatePermissions } from '@/src/server/validators';
import { OperationType, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { createNextErrorResponse } from '@/src/server/error';
import User from '@/models/IUser';
import { IUserPermission } from '@/models/shared/types';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    //Todo add to the call of the get trip the type of wanted view
    await dbConnect();
    const userId = await authAndGetUserId();
    const trip = await Trip.findById(params.id).populate({
      path: 'locations.location_id',
      model: 'Location',
    });
    validatePermissions(userId, trip?.permissions, TripPermissionEnum.ViewBasic, OperationType.GET);
    return NextResponse.json(mapTripToFullTrip(trip) as ITrip);
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

    const tripToSave = await buildTripToSave(trip, userId, true);

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: params.id, owner_id: userId },
      { $set: tripToSave },
      { new: true },
    );
    const tripId = updatedTrip._id;
    const usersId = updatedTrip.permissions.map((permission: IUserPermission) => permission.userId);
    await User.updateMany(
      {
        _id: { $in: usersId },
        trips: { $ne: tripId },
      },
      { $addToSet: { trips: tripId } },
    );
    //Todo- decide what to do with trip locations regarding permission
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
    //Todo- update users that we given permission on location because trip was shared with them
    return NextResponse.json({ message: `Trip ${params.id} has been deleted` });
  } catch (error) {
    return createNextErrorResponse(error);
  }
}
