import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation } from '@/models/Location';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body: ILocation = await req.json();
    if (body.name) {
      const locations = await Location.create(body);
      return NextResponse.json(
        { locations, message: 'Your Location has been created' },
        { status: HttpStatusCode.Created },
      );
    }
    return NextResponse.json({ message: 'Location name is missing' }, { status: HttpStatusCode.BadRequest });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export const GET = async () => {
  try {
    await dbConnect();
    const locations = await Location.find();
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error });
  }
};
