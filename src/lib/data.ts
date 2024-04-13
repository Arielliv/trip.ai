import { ITrip } from '@/models/Trip';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { ILocation } from '@/models/Location';

export async function fetchTrips(): Promise<ITrip[]> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trips`);
  return res.data as ITrip[];
}

export interface LocationPaginationResponse {
  locations: ILocation[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export async function fetchLocations(page: number, limit: number = 10): Promise<LocationPaginationResponse> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return res.data as LocationPaginationResponse;
}
