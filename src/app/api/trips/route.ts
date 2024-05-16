import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import Trip, { ITrip, ITripDto } from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const owner = session.user.id;
    const tripData: ITrip = await req.json();

    if (!tripData.name) {
      return NextResponse.json({ message: 'Trip name is missing' }, { status: HttpStatusCode.BadRequest });
    }
    console.log(`new trip: ${JSON.stringify(tripData)}, ${JSON.stringify(tripData)}`);

    const trip: ITripDto = await Trip.create<ITripDto>({ ...tripData, owner });

    return NextResponse.json(
      {
        location: trip,
        message: 'Your Trip has been created',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to create Trip:', error);

    return NextResponse.json(
      // @ts-ignore
      { message: 'Failed to create location', error: error.toString() },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};

export const GET = async () => {
  try {
    await dbConnect();
    const trips = await Trip.find();
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error });
  }
};
