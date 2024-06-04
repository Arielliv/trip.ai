import Trip from '@/models/Trip';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { FilterQuery } from 'mongoose';
import { calculateOverallDateRange } from '@/models/utils/calculateOverallDateRange';
import { escapeRegex } from '@/models/utils/escapeRegex';

interface SearchQuery {
  $or?: { name: RegExp } | { 'locations.additionalInfo': RegExp }[];
  'locations.address.country'?: string;
  'totals.totalAmountOfDays'?: { $gte: number; $lte: number };
  'totals.totalCost'?: { $gte: number; $lte: number };
}

export const GET = async (req: NextRequest) => {
  await dbConnect();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const freeTextFilter = url.searchParams.get('freeText');
  const locationFilter = url.searchParams.get('location');
  const timeFilter = url.searchParams.get('time')?.split(',');
  const minPrice = parseInt(url.searchParams.get('minPrice') || '0', 10);
  const maxPrice = parseInt(url.searchParams.get('maxPrice') || '10000', 10);

  const searchQuery: FilterQuery<SearchQuery> = {};

  if (freeTextFilter) {
    const regex = new RegExp(escapeRegex(freeTextFilter), 'i');
    searchQuery['$or'] = [{ name: regex }, { 'locations.additionalInfo': regex }];
  }

  if (timeFilter && timeFilter.length > 0) {
    const totalAmountOfDaysRange = calculateOverallDateRange(timeFilter);
    if (totalAmountOfDaysRange) {
      searchQuery['totals.totalAmountOfDays'] = totalAmountOfDaysRange;
    }
  }

  if (minPrice || maxPrice) {
    searchQuery['totals.totalCost'] = { $gte: minPrice, $lte: maxPrice };
  }

  try {
    const [trips, totalCount] = await Promise.all([
      Trip.find(searchQuery)
        // .populate({
        //   path: 'locations.location_id',
        //   model: 'Location',
        //   match: locationFilter ? { 'address.country': locationFilter } : {},
        // })
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
    console.error('Failed to fetch trips:', error);
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
  }
};
