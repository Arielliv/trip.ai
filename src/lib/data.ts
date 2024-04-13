import { ITrip } from '@/models/Trip';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { ILocation } from '@/models/Location';

export async function fetchTrips(): Promise<ITrip[]> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trips`);
  return res.data as ITrip[];
}

export async function createLocation(newLocation: ILocation): Promise<ILocation> {
  noStore();
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/locations`, newLocation);
  return res.data as ILocation;
}
