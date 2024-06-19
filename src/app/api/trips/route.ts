import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import Trip, { ITrip, ITripDto } from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { buildTripToSave } from '@/models/builders/buildTripToSave';
import {
  authAndGetUserId,
  getUserById,
  saveTripIdInManyUsers,
  updateLocationsPermissions,
  updateLocationsTripsArray,
} from '@/src/server/utils';
import { validateRequiredField } from '@/src/server/validators';
import { createNextErrorResponse } from '@/src/server/error';
import { ObjectId } from 'mongodb';
import { EntityType } from '@/models/constants/constants';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const owner_id = await authAndGetUserId();
    const tripData: ITrip = await req.json();
    const trip = await createTripInDB(tripData, owner_id);

    return NextResponse.json(
      {
        trip,
        message: 'Your Trip has been created',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to create Trip:', error);
    return createNextErrorResponse(error);
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const page = parseInt(url?.searchParams?.get('page') || '0', 10) || 0;
  const limit = parseInt(url?.searchParams?.get('limit') || '0', 10) || 0;

  try {
    await dbConnect();

    const user_id = await authAndGetUserId();

    const user = await getUserById(user_id);

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

export const createTripInDB = async (tripData: ITrip, owner_id: string) => {
  validateRequiredField(EntityType.Trip, 'name', tripData.name);

  const tripDto = await buildTripToSave(tripData, owner_id, false);
  const trip: ITripDto = await Trip.create<ITripDto>(tripDto);
  const locationIds = trip.locations.map((location) => location.location_id);
  if (locationIds.length > 0) {
    await updateLocationsTripsArray(locationIds, [], trip._id ? new ObjectId(trip._id) : null);
    await updateLocationsPermissions(locationIds, trip.permissions);
  }

  const usersWithPermissions = trip.permissions?.map((permission) => permission.userId);
  if (usersWithPermissions) {
    await saveTripIdInManyUsers(usersWithPermissions, trip._id);
  }
  return trip;
};
