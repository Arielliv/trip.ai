import { ErrorType, ServerError } from '@/src/server/error';
import { LocationPermissionEnum, OperationType } from '@/models/enums/permissionsEnums';
import { authorize } from '@/src/server/validators';
import User, { IUser } from '@/models/IUser';
import { IUserPermission } from '@/models/shared/types';

export const validateLocationName = (name: string | undefined) => {
  if (!name) {
    throw new ServerError('Location name is missing', ErrorType.IllegalArgumentError);
  }
};

export const validatePermissions = (
  userId: string,
  permissions: IUserPermission[] | undefined,
  requiredPermission: LocationPermissionEnum,
  operationType: OperationType,
) => {
  if (!permissions || !authorize(userId, permissions, requiredPermission)) {
    throw new ServerError(
      `User does not have permission for ${operationType} operation`,
      ErrorType.AouthorizationError,
    );
  }
};

export const getUserOrThrow = async (userId: string) => {
  const user: IUser | null = await User.findById(userId);
  if (!user) {
    throw new ServerError('User was not found', ErrorType.NotFoundError);
  }
  return user;
};
