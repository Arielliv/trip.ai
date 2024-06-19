import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation, ILocationDto } from '@/models/Location';
import { ObjectId } from 'mongodb';
import { authAndGetUserId } from '@/src/server/utils';
import { createNextErrorResponse } from '@/src/server/error';
import User from '@/models/IUser';
import { validateRequiredField, validatePermissions } from '@/src/server/validators';
import { EntityType, LocationPermissionEnum, OperationType } from '@/models/constants/constants';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const userId = await authAndGetUserId();
    const location: ILocationDto | null = await Location.findById(params.id);
    validatePermissions(userId, location?.permissions, LocationPermissionEnum.view, OperationType.GET);
    return NextResponse.json({ location });
  } catch (error) {
    return createNextErrorResponse(error);
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();

    const userId = await authAndGetUserId();
    const body: ILocation = await req.json();
    const locationToUpdate: ILocation | null = await Location.findById({
      _id: params.id,
    });

    validateRequiredField(EntityType.Location, 'name', body.name);
    validatePermissions(userId, locationToUpdate?.permissions, LocationPermissionEnum.edit, OperationType.UPDATE);

    const { permissions, ...rest } = body;
    const updatedLocation = await Location.findOneAndUpdate(
      { _id: locationToUpdate?._id },
      { $set: rest },
      { new: true },
    );

    return NextResponse.json(
      {
        location: updatedLocation,
        message: 'Location updated successfully',
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error('Failed to update location:', error);
    return createNextErrorResponse(error);
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const objectIdToDelete = new ObjectId(params.id);
    const userId = await authAndGetUserId();
    const location: ILocationDto | null = await Location.findById(objectIdToDelete);
    validatePermissions(userId, location?.permissions, LocationPermissionEnum.admin, OperationType.DELETE);
    await Location.findByIdAndDelete(location?._id);
    await User.updateMany({ locations: location?._id }, { $pull: { locations: location?._id } });

    return NextResponse.json({ message: `Location ${params.id} has been deleted` });
  } catch (error) {
    console.error('Got an error trying to delete location file', error);
    return createNextErrorResponse(error);
  }
}
