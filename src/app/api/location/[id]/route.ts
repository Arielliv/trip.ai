import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation } from '@/models/Location';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

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

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const body: ILocation = await req.json();

    if (!body.name) {
      return NextResponse.json({ message: 'Location name is missing' }, { status: HttpStatusCode.BadRequest });
    }

    const updatedLocation = await Location.findOneAndUpdate(
      { _id: params.id, user_id: session.user.id },
      { $set: body },
      { new: true },
    );

    if (!updatedLocation) {
      return NextResponse.json(
        { message: `Location ${params.id} not found / user not authorized` },
        { status: HttpStatusCode.NotFound },
      );
    }

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
