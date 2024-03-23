import { Types } from 'mongoose';
import { Role } from '@/models/constants';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Permission {
  user_id: Types.ObjectId;
  role: Role;
}

// Note: Import or define the Address interface according to your actual model
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
