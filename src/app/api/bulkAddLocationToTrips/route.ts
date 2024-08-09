import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocationDto } from '@/models/Location';
import { createNextErrorResponse } from '@/src/server/error';
import { getUserOrThrow } from '@/src/server/validators';
import { authAndGetUserId } from '@/src/server/utils';
import { saveLocationInUser } from '@/src/server/userUtils';
import Trip, { ILocationInTrip, ITrip } from '@/models/Trip';
import { LocationPermissionEnum } from '@/models/constants/constants';
import { ObjectId } from 'mongodb';
import { updateTripDataInOtherDocuments } from '@/src/server/tripUtils';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const userId = await authAndGetUserId();
    const addLocationToTripObject: { location: ILocationInTrip; tripIds: string[] } = await req.json();
    const user = await getUserOrThrow(userId);

    const newLocationDto: ILocationDto = await Location.create<ILocationDto>({
      ...addLocationToTripObject.location.connectedLocationData,
      _id: undefined,
      user_id: userId,
      trips: [],
      permissions: [{ userId: userId, permissionType: LocationPermissionEnum.admin }],
    });

    if (newLocationDto === null) {
      return NextResponse.json(
        {
          message: 'Location was not created found',
        },
        { status: HttpStatusCode.NotFound },
      );
    }

    await saveLocationInUser(user, newLocationDto);

    await Promise.all(
      addLocationToTripObject.tripIds.map(async (tripId) => {
        const oldTrip = await Trip.findById<ITrip>(tripId);
        const updatedTrip: ITrip | null = await Trip.findOneAndUpdate(
          { _id: tripId, owner_id: userId },
          { $push: { locations: { ...addLocationToTripObject.location, location_id: newLocationDto._id } } },
          { new: true },
        );

        return updateTripDataInOtherDocuments(
          updatedTrip?.locations,
          oldTrip?.locations,
          updatedTrip?.permissions,
          new ObjectId(updatedTrip?._id),
        );
      }),
    );

    return NextResponse.json(
      {
        message: 'Your Location has added to selected trips',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to added location to selected trips:', error);
    return createNextErrorResponse(error);
  }
};
