import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { HttpStatusCode } from 'axios';
import Trip from '@/models/Trip';
import User from '@/models/IUser';
import Location from '@/models/Location';
import { authAndGetUserId } from '@/src/server/utils';

export const POST = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const owner_id = await authAndGetUserId();

    const { id } = params;

    const trip = await Trip.findById(id);
    const cloneTrip = trip.toObject();
    delete cloneTrip._id;
    cloneTrip.name += '-duplicated';
    cloneTrip.owner_id = owner_id;

    const cloned = new Trip(cloneTrip);

    const [newTrip, _manyUpdatedLocations, _updatedUser] = await Promise.all([
      cloned.save(),
      Location.updateMany({ _id: { $in: cloned.locations } }, { $push: { arrayField: cloned._id } }, { new: true }),
      User.updateOne().findOneAndUpdate(
        { _id: owner_id },
        { $push: { trips: cloned._id, locations: { $each: cloned.locations } } },
        { new: true },
      ),
    ]);

    return NextResponse.json(
      {
        trip: newTrip,
        message: 'Trip has been cloned',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to clone Trip:', error);

    return NextResponse.json(
      // @ts-ignore
      { message: 'Failed to clone location', error: error.toString() },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};
