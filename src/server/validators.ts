import { IUserPermission } from '@/models/shared/types';
import { findUserPermissions } from '@/src/server/utils';
import { LocationPermissionEnum, OperationType, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { ILocation } from '@/models/Location';
import { ErrorType, ServerError } from '@/src/server/error';
import User, { IUser } from '@/models/IUser';

export const authorize = (
  userId: string,
  permissions: IUserPermission[],
  action: LocationPermissionEnum | TripPermissionEnum,
): boolean => {
  const permission = findUserPermissions(userId, permissions);
  if (!permission) {
    return false;
  }
  const sameType = typeof action === typeof permission;
  return sameType && action >= permission.permissionType;
};

export const validateName = (name: string | undefined) => {
  if (!name) {
    throw new ServerError('Location name is missing', ErrorType.IllegalArgumentError);
  }
};

export const getUserOrThrow = async (userId: string) => {
  const user: IUser | null = await User.findById(userId);
  if (!user) {
    throw new ServerError('User was not found', ErrorType.NotFoundError);
  }
  return user;
};

export const validatePermissions = (
  userId: string,
  permissions: IUserPermission[] | undefined,
  requiredPermission: LocationPermissionEnum | TripPermissionEnum,
  operationType: OperationType,
) => {
  if (!permissions || !authorize(userId, permissions, requiredPermission)) {
    throw new ServerError(
      `User does not have permission for ${operationType} operation`,
      ErrorType.AouthorizationError,
    );
  }
};
