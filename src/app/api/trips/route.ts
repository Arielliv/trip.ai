import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import Trip, { ITrip } from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body: ITrip = await req.json();
    if (body.name) {
      const trips = await Trip.create(body);
      return NextResponse.json({ trips, message: 'Your trip has been created' }, { status: HttpStatusCode.Created });
    }
    return NextResponse.json({ message: 'Trip name is missing' }, { status: HttpStatusCode.BadRequest });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
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
