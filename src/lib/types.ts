import { ILocation } from '@/models/Location';
import { ITrip } from '@/models/Trip';
import { IUser } from '@/models/IUser';

export interface LocationsResponse {
  locations: ILocation[];
}

export interface UsersResponse {
  users: IUser[];
}

export interface TripsResponse {
  trips: ITrip[];
}

export interface PaginationResponse {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export type LocationsPaginationResponse = LocationsResponse & PaginationResponse;
export type TripsPaginationResponse = TripsResponse & PaginationResponse;
export type UsersPaginationResponse = UsersResponse & PaginationResponse;
