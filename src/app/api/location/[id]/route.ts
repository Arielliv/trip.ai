import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation } from '@/models/Location';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import { authorize } from '@/app/server/validators';
import { LocationPermissionEnum } from '@/models/enums/permissionsEnums';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const location = await Location.findById(params.id);
    if (location) {
      return NextResponse.json({ location });
    }
    return NextResponse.json({ message: `Location ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }
    const userId = session.user.id;

    const body: ILocation = await req.json();
    const locationToUpdate: ILocation | null = await Location.findById({
      _id: params.id,
    });

    if (!locationToUpdate?.permissions) {
      return NextResponse.json(
        {
          message: 'Error no user permissions were found',
        },
        { status: HttpStatusCode.InternalServerError },
      );
    }

    if (!body.name) {
      return NextResponse.json({ message: 'Location name is missing' }, { status: HttpStatusCode.BadRequest });
    }

    if (!body.permissions || !authorize(userId, locationToUpdate.permissions, LocationPermissionEnum.edit)) {
      return NextResponse.json(
        {
          message: 'User does not have permissions to edit this location',
          status: HttpStatusCode.Unauthorized,
        },
        { status: HttpStatusCode.Unauthorized },
      );
    }
    const { permissions, ...rest } = body;
    await Location.updateOne({ _id: locationToUpdate._id }, { $set: rest });

    const updatedLocation = await Location.findById({
      _id: params.id,
    });

    return NextResponse.json(
      {
        location: updatedLocation,
        message: 'Location updated successfully',
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error('Failed to update location:', error);

    return NextResponse.json(
      { message: 'Failed to update location', error: error },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const objectIdToDelete = new ObjectId(params.id);
    console.log('Trying to delete a location form db:', objectIdToDelete);
    await dbConnect();
    const location = await Location.findById(objectIdToDelete);
    if (location) {
      await Location.findByIdAndDelete(location._id);
      return NextResponse.json({ message: `Location ${params.id} has been deleted` });
    }
    return NextResponse.json({ message: `Location ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    console.error('Got an error trying to delete location file', error);
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
}
