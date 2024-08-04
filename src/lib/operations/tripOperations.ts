import { ITrip } from '@/models/Trip';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { TripsPaginationResponse } from '@/lib/types';
import { Filters } from '@/app/hooks/useManageSearchQueryParams';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';

export async function fetchTripById(id: string): Promise<ITrip> {
  noStore();
  const res = await axios.get(`/api/trip/${id}`);
  return res.data as ITrip;
}

export async function fetchTrips(page: number, limit: number = 10): Promise<TripsPaginationResponse> {
  noStore();
  const res = await axios.get(`/api/trips`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return res.data as TripsPaginationResponse;
}

export async function searchTrips(filters?: Filters, page = 0, limit = 10): Promise<TripsPaginationResponse> {
  noStore();
  const res = await axios.get(`/api/searchTrips`, {
    params: {
      ...(filters && filters.freeTextFilter && { freeText: filters.freeTextFilter }),
      ...(filters && filters.locationFilter && { location: filters.locationFilter }),
      ...(filters && filters.timeFilter && { time: filters.timeFilter.join(',') }),
      ...(filters && filters.priceRangeFilter?.minPrice && { minPrice: filters.priceRangeFilter.minPrice }),
      ...(filters && filters.priceRangeFilter?.maxPrice && { maxPrice: filters.priceRangeFilter.maxPrice }),
      page: page,
      limit: limit,
    },
  });

  return res.data as TripsPaginationResponse;
}

export async function createTrip(newTrip: ITrip): Promise<ITrip> {
  noStore();
  const res = await axios.post(`/api/trips`, newTrip);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.trip as ITrip;
}

export async function generateTrip(generateTripData: GenerateTripFormData): Promise<ITrip> {
  noStore();
  const res = await axios.post(`/api/generateTrip`, generateTripData);
  console.log(res.data.message);
  return res.data.trip as ITrip;
}

export async function updateTrip(updatedTrip: ITrip): Promise<ITrip> {
  noStore();
  const res = await axios.put(`/api/trip/${updatedTrip._id}`, updatedTrip);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.trip as ITrip;
}

export async function deleteTrip(tripId: string) {
  return axios.delete(`/api/trip/${tripId}`);
}

export async function duplicateTrip(tripId: string) {
  return axios.post(`/api/duplicateTrip/${tripId}`);
}
