import { Schema, Types, model, models } from 'mongoose';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/PermissionsEnums';

export interface IUserPermission {
  _id?: string;
  userId: Types.ObjectId;
  permissionType: TripPermissionEnum | LocationPermissionEnum;
}

export const userPermissionScheme = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  permissionType: {
    type: String,
    enum: [...Object.values(TripPermissionEnum), ...Object.values(LocationPermissionEnum)],
    required: true,
  },
});

export const UserPermission = models.userPermission || model<IUserPermission>('UserPermission', userPermissionScheme);
