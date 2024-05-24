import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import Trip, { ITrip, ITripDto, LocationInTrip } from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';
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

    const trip: ITripDto = await Trip.create<ITripDto>({ ...tripData, owner_id });

    const updatePromises = trip.locations.map(async (location: LocationInTrip) => {
      const locationId = location.location_id;
      const foundLocation = await Location.findById(locationId);

      if (!foundLocation) {
        console.error(`Location with ID ${locationId} not found`);
        return;
      }

      console.log(trip._id);
      foundLocation.trips.push(trip._id);
      await foundLocation.save();
    });

    await Promise.all(updatePromises);

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

    const trips = await Trip.find()
      .skip(page * limit)
      .limit(limit);

    // Optionally, get the total count of documents
    const totalCount = await Trip.countDocuments();

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
