import { ILocation } from '@/models/Location';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { LocationsPaginationResponse } from '@/lib/types';

export async function createLocation(newLocation: ILocation): Promise<ILocation> {
  noStore();
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/locations`, newLocation);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.location as ILocation;
}

export async function updateLocation(updatedLocation: ILocation): Promise<ILocation> {
  noStore();
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/location/${updatedLocation._id}`, updatedLocation);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.location as ILocation;
}

export async function deleteLocation(locationId: string) {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/location/${locationId}`);
}

export async function fetchLocations(
  page: number,
  limit: number = 10,
  tripId?: string,
): Promise<LocationsPaginationResponse> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
    params: {
      page,
      limit,
      tripId,
    },
  });
  return res.data as LocationsPaginationResponse;
}

export async function fetchLocation(id: string): Promise<ILocation> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/location/${id}`);
  return res.data as ILocation;
}
