import { IUserPermission } from '@/models/shared/types';
import { auth } from '@/auth';
import { ErrorType, ServerError } from '@/src/server/error';

export function findUserPermissions(userId: string, permissions: IUserPermission[]): IUserPermission | undefined {
  return permissions.find((permissionObj) => permissionObj.userId.toString() === userId);
}

export const authAndGetUserId = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    throw new ServerError('User Authentication failed', ErrorType.AuthenticationError);
  }
  const user = session.user;
  if (!user?.id) {
    throw new ServerError('Tried to fetch user id from null variable', ErrorType.NullPointerError);
  }
  return user.id;
};
