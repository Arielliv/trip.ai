import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Location, { ILocation } from '@/models/Location';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const location = await Location.findById(params.id);
    if (location) {
      return NextResponse.json({ location });
    }
    return NextResponse.json({ message: `Location ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const location = await Location.findById(params.id);
    if (location) {
      const body: ILocation = await req.json();
      if (body.name) {
        location.name = body.name;
      }
      location.save();
      return NextResponse.json({ location });
    }
    return NextResponse.json({ message: `Location ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const location = await Location.findById(params.id);
    if (location) {
      await Location.findByIdAndDelete(location._id);
      return NextResponse.json({ message: `Location ${params.id} has been deleted` });
    }
    return NextResponse.json({ message: `Location ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
}
