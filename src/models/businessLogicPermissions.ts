import { Schema, Document, Types, models, model } from 'mongoose';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/PermissionsEnums';

export interface BLPermissions extends Document {
  permissionPerUser: singleUserPermissions[];
}

export interface singleUserPermissions extends Document {
  user_id: Types.ObjectId;
  permissionTypes: TripPermissionEnum | LocationPermissionEnum;
}

export const singleUserPermissionScheme = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    permissionTypes: {
      type: String,
      enum: [...Object.values(TripPermissionEnum), ...Object.values(LocationPermissionEnum)],
      required: true
    }
  });

export const permissionScheme = new Schema({
  userPermissions: {
    type: [singleUserPermissionScheme]
  }
});


export const SingleUserPermissionsPerObjectModel = models.SingleUserPermissionsPerObjectModel || model<singleUserPermissions>('singleUserPermissions', singleUserPermissionScheme);
export const PermissionsModel = models.PermissionsModels || model<BLPermissions>('Permissions', permissionScheme);