import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import Trip, { ITrip, ITripDto } from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import User from '@/models/User';
import Location from '@/models/Location';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const owner_id = session.user.id;
    const tripData: ITrip = await req.json();

    if (!tripData.name) {
      return NextResponse.json({ message: 'Trip name is missing' }, { status: HttpStatusCode.BadRequest });
    }

    console.log(`new trip: ${JSON.stringify(tripData)}, ${JSON.stringify(tripData)}`);

    const tripDto = await buildTripToSave(tripData, owner_id);
    const trip: ITripDto = await Trip.create<ITripDto>(tripDto);
    const locationIds = trip.locations.map((location) => location.location_id);
    const updatedLocations = await Location.updateMany(
      { _id: { $in: locationIds } },
      { $addToSet: { trips: trip._id } },
    );
    const updatedUser = await User.findOneAndUpdate(
      { _id: owner_id },
      { $addToSet: { trips: trip._id } },
      { new: true },
    );

    if (!updatedLocations) {
      return NextResponse.json(
        { message: `Some locations of ${locationIds} not found / user not authorized` },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (!updatedUser) {
      return NextResponse.json({ message: `User ${owner_id} not found` }, { status: HttpStatusCode.NotFound });
    }

    return NextResponse.json(
      {
        trip,
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

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const page = parseInt(url?.searchParams?.get('page') || '0', 10) || 0;
  const limit = parseInt(url?.searchParams?.get('limit') || '0', 10) || 0;

  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const user_id = session.user.id;
    const user: User | null = await User.findById(user_id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: HttpStatusCode.NotFound });
    }

    const searchQuery = { _id: { $in: user.trips } };

    const [trips, totalCount] = await Promise.all([
      Trip.find(searchQuery)
        .skip(page * limit)
        .limit(limit),
      Trip.countDocuments(searchQuery),
    ]);

    return NextResponse.json({
      trips,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    // @ts-ignore
    return NextResponse.json({ error: error.message });
  }
};
