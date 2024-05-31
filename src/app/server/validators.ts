import { IUserPermission } from '@/models/shared/types';
import { findUserPermissions } from '@/app/server/utils';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/permissionsEnums';

export function authorize(
  userId: string,
  permissions: IUserPermission[],
  action: LocationPermissionEnum | TripPermissionEnum,
): boolean {
  const permission = findUserPermissions(userId, permissions);
  if (!permission) {
    return false;
  }
  return action === permission.permissionType;
}
