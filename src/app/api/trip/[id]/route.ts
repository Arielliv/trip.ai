import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ITrip } from '@/models/Trip';
import { mapTripToFullTrip } from '@/models/mappers/mapTripToFullTrip';
import { auth } from '@/auth';
import { buildTripToSave } from '@/models/builders/buildTripToSave';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id).populate({
      path: 'locations.location_id',
      model: 'Location',
    });
    if (trip) {
      return NextResponse.json(mapTripToFullTrip(trip) as ITrip);
    }
    return NextResponse.json({ message: `Trip ${params.id} not found` }, { status: HttpStatusCode.NotFound });
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

    const trip: ITrip = await req.json();

    if (!trip.name) {
      return NextResponse.json({ message: 'Trip name is missing' }, { status: HttpStatusCode.BadRequest });
    }

    const tripToSave = await buildTripToSave(trip);

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: params.id, owner_id: session.user.id },
      { $set: tripToSave },
      { new: true },
    );

    if (!updatedTrip) {
      return NextResponse.json(
        { message: `Trip ${params.id} not found / user not authorized` },
        { status: HttpStatusCode.NotFound },
      );
    }

    return NextResponse.json(
      {
        trip: updatedTrip,
        message: 'Trip updated successfully',
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error('Failed to update trip:', error);

    return NextResponse.json(
      { message: 'Failed to update trip', error: error },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (trip) {
      await Trip.findByIdAndDelete(trip._id);
      return NextResponse.json({ message: `Trip ${params.id} has been deleted` });
    }
    return NextResponse.json({ message: `Trip ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
}
