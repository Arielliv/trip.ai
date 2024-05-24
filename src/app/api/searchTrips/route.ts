// pages/api/searchTrips.js
import Trip from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const page = parseInt(url?.searchParams?.get('page') || '0', 10) || 0;
  const limit = parseInt(url?.searchParams?.get('limit') || '0', 10) || 0;
  const search = url?.searchParams?.get('search') || undefined;

  await dbConnect();

  try {
    const regexSearch = search ? new RegExp(escapeRegex(search), 'i') : undefined;

    const searchQuery = regexSearch
      ? {
          $or: [{ name: regexSearch }, { 'locations.additionalInfo': regexSearch }],
        }
      : {};
    console.log('searchQuery', searchQuery);

    // console.log('searchQuery', searchQuery);
    const [trips, totalCount] = await Promise.all([
      Trip.find(searchQuery)
        .skip(page * limit)
        .limit(limit),
      Trip.countDocuments(searchQuery),
    ]);

    return NextResponse.json(
      {
        trips,
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};
