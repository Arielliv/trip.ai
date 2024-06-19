import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation, ILocationDto } from '@/models/Location';
import { createNextErrorResponse } from '@/src/server/error';
import { getUserOrThrow, validateRequiredField } from '@/src/server/validators';
import { IUser } from '@/models/IUser';
import { authAndGetUserId } from '@/src/server/utils';
import { EntityType, LocationPermissionEnum } from '@/models/constants/constants';
import { saveLocationInUser } from '@/src/server/userUtils';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const userId = await authAndGetUserId();
    const locationData: ILocation = await req.json();
    const user = await getUserOrThrow(userId);
    validateRequiredField(EntityType.Location, 'name', locationData.name);

    const newLocationDto: ILocationDto = await Location.create<ILocationDto>({
      ...locationData,
      user_id: userId,
      permissions: [{ userId: userId, permissionType: LocationPermissionEnum.admin }],
    });

    await saveLocationInUser(user, newLocationDto);

    return NextResponse.json(
      {
        location: newLocationDto,
        message: 'Your Location has been created',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to create location:', error);
    return createNextErrorResponse(error);
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const page = parseInt(url?.searchParams?.get('page') || '0', 10) || 0;
  const limit = parseInt(url?.searchParams?.get('limit') || '0', 10) || 0;
  const tripId = url?.searchParams?.get('tripId');

  try {
    await dbConnect();
    const userId = await authAndGetUserId();
    const user: IUser | null = await getUserOrThrow(userId);

    const locations = await Location.find({
      _id: { $in: user.locations },
      ...(tripId && { trips: tripId }),
    })
      .skip(page * limit)
      .limit(limit);

    // Optionally, get the total count of documents
    const totalCount = await Location.countDocuments();

    return NextResponse.json({
      locations,
      page,
      limit,
      tripId,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    return createNextErrorResponse(error);
  }
};
