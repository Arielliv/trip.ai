import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation, ILocationDto } from '@/models/Location';
import { UserPermission } from '@/models/userPermission';
import { IUserPermission } from '@/models/userPermission';
import { auth } from '@/auth';
import { LocationPermissionEnum } from '@/models/enums/PermissionsEnums';
import { Types } from 'mongoose';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const user_id = session.user.id;
    const locationData: ILocation = await req.json();

    if (!locationData.name) {
      return NextResponse.json({ message: 'Location name is missing' }, { status: HttpStatusCode.BadRequest });
    }
    const userPermission = await createUserPermission(user_id, LocationPermissionEnum.edit.toString());
    const location: ILocationDto = await Location.create<ILocationDto>({
      ...locationData,
      user_id,
      permissions: [userPermission._id],
    });

    return NextResponse.json(
      {
        location,
        message: 'Your Location has been created',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to create location:', error);

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

    const locations = await Location.find()
      .skip(page * limit)
      .limit(limit);

    // Optionally, get the total count of documents
    const totalCount = await Location.countDocuments();

    return NextResponse.json({
      locations,
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

async function createUserPermission(userIdStr: string | undefined, permissionType: string) {
  if (!userIdStr || !permissionType) {
    throw { message: 'Cannot create user permission' };
  }

  const userId = new Types.ObjectId(userIdStr);
  const userPermission: IUserPermission = await UserPermission.create<IUserPermission>({
    userId,
    permissionType,
  });

  return userPermission;
}
