import { ITrip } from '@/models/Trip';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { ILocation } from '@/models/Location';
import { LocationsPaginationResponse, TripsPaginationResponse } from '@/lib/types';

export async function fetchTrips(page: number, limit: number = 10): Promise<TripsPaginationResponse> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return res.data as TripsPaginationResponse;
}

export async function createTrip(newTrip: ITrip): Promise<ITrip> {
  noStore();
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/trips`, newTrip);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.trip as ITrip;
}

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

export async function deleteTrip(tripId: string) {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/trip/${tripId}`);
}

export async function fetchLocations(page: number, limit: number = 10): Promise<LocationsPaginationResponse> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return res.data as LocationsPaginationResponse;
}
