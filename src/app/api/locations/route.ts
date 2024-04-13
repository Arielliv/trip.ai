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
