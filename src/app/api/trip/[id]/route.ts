import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from 'axios';
import dbConnect from '@/lib/dbConnect';
import Trip, { ITrip } from '@/models/Trip';
import { auth } from '@/auth';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (trip) {
      return NextResponse.json({ trip });
    }
    return NextResponse.json({ message: `Trip ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (trip) {
      const body: ITrip = await req.json();
      if (body.name) {
        trip.name = body.name;
      }
      trip.save();
      return NextResponse.json({ trip });
    }
    return NextResponse.json({ message: `Trip ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (trip) {
      await Trip.findByIdAndDelete(trip._id);
      return NextResponse.json({ message: `Trip ${params.id} has been deleted` });
    }
    return NextResponse.json({ message: `Trip ${params.id} not found` }, { status: HttpStatusCode.NotFound });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
}
