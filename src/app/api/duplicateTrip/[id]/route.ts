import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';
import { HttpStatusCode } from 'axios';
import Trip from '@/models/Trip';
import User from '@/models/User';
import Location from '@/models/Location';

export const POST = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const owner_id = session.user.id;
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
        { $push: { trips: cloned._id, locations: cloned.locations } },
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
