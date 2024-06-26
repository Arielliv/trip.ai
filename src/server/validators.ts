import { IUserPermission } from '@/models/shared/types';
import { findUserPermissions } from '@/src/server/utils';
import { ErrorType, ServerError } from '@/src/server/error';
import User, { IUser } from '@/models/IUser';
import { LocationPermissionEnum, OperationType, TripPermissionEnum } from '@/models/constants/constants';

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

export const validateRequiredField = (
  entityName: string,
  requiredFieldName: string,
  requiredField: string | undefined,
) => {
  if (!requiredField) {
    throw new ServerError(`${entityName} ${requiredFieldName} is missing`, ErrorType.IllegalArgumentError);
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

export const validateNonNullArguments = (...args: unknown[]) => {
  args.forEach((arg) => {
    if (!arg) {
      throw new Error('One of the arguments is null');
    }
  });
};
