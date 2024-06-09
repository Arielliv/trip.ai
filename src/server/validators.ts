import { IUserPermission } from '@/models/shared/types';
import { findUserPermissions } from '@/src/server/utils';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { ILocation } from '@/models/Location';
import { ErrorType, ServerError } from '@/src/server/error';

export const authorize = (
  userId: string,
  permissions: IUserPermission[],
  action: LocationPermissionEnum | TripPermissionEnum,
): boolean => {
  const permission = findUserPermissions(userId, permissions);
  if (!permission) {
    return false;
  }
  return action >= permission.permissionType;
};
