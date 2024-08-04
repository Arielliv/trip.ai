import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { HttpStatusCode } from 'axios';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';
import { authAndGetUserId, getUserById } from '@/src/server/utils';
import { generateTrip } from '@/src/server/generateUtils';
import { bulkCreateLocations } from '@/src/server/locationUtils';
import { createTripInDB } from '@/app/api/trips/route';
import { Visibility } from '@/models/constants';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const owner_id = await authAndGetUserId();
    const user = await getUserById(owner_id);

    const tripDetails: GenerateTripFormData = await req.json();

    if (!tripDetails) {
      return NextResponse.json({ message: 'Missing trip details' }, { status: HttpStatusCode.BadRequest });
    }
    const suggestedTrip = await generateTrip(tripDetails);

    console.log('openAi response', suggestedTrip);

    const newLocations = await bulkCreateLocations(suggestedTrip.locations, owner_id, user);
    const trip = await createTripInDB(
      { ...suggestedTrip, locations: newLocations, visibility: Visibility.Private },
      owner_id,
    );

    return NextResponse.json(
      {
        trip,
        message: 'Your Trip has been generated',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to generate your trip:', error);

    return NextResponse.json(
      // @ts-ignore
      { message: 'Failed to generate your trip', error: error.toString() },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};
