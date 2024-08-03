import { ILocation } from '@/models/Location';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';
import { LocationsPaginationResponse, StorageContainerName } from '@/lib/types';

export async function createLocation(newLocation: { location: ILocation; files?: File[] }): Promise<ILocation> {
  noStore();

  const filesRes = await axios.post(
    '/api/storage',
    { files: newLocation.files, storageLocation: StorageContainerName.Locations },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  newLocation.location.files = filesRes.data.files;
  const res = await axios.post('/api/locations', newLocation.location);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.location as ILocation;
}

export async function updateLocation(updatedLocation: { location: ILocation; files?: File[] }): Promise<ILocation> {
  noStore();
  const filesRes = await axios.post(
    '/api/storage',
    { files: updatedLocation.files, storageLocation: StorageContainerName.Locations },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  updatedLocation.location.files = filesRes.data.files;
  const res = await axios.put(`/api/location/${updatedLocation.location._id}`, updatedLocation.location);
  console.log(`${res.data.message} with id ${res.data.id}`);
  return res.data.location as ILocation;
}

export async function deleteLocation(locationId: string) {
  return axios.delete(`/api/location/${locationId}`);
}

export async function fetchLocations(
  page: number,
  limit: number = 10,
  tripId?: string,
): Promise<LocationsPaginationResponse> {
  noStore();
  const res = await axios.get(`/api/locations`, {
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
  const res = await axios.get(`/api/location/${id}`);
  return res.data as ILocation;
}
