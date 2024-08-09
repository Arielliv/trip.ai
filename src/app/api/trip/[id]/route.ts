import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ITrip } from '@/models/Trip';
import { mapTripToFullTrip } from '@/models/mappers/mapTripToFullTrip';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import { authAndGetUserId } from '@/src/server/utils';
import { validateRequiredField, validatePermissions } from '@/src/server/validators';
import { createNextErrorResponse } from '@/src/server/error';
import User from '@/models/IUser';
import { ObjectId } from 'mongodb';
import { EntityType, OperationType, TripPermissionEnum } from '@/models/constants/constants';
import { updateTripDataInOtherDocuments } from '@/src/server/tripUtils';

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
    validateRequiredField(EntityType.Trip, 'name', trip?.name);
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
