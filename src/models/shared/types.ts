/* v8 ignore start */
import { Types } from 'mongoose';
import { Role } from '@/models/constants';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/permissionsEnums';

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

export interface IUserPermission {
  userId: Types.ObjectId;
  permissionType: TripPermissionEnum | LocationPermissionEnum;
}

/* v8 ignore stop */
