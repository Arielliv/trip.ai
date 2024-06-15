import { IUserPermission } from '@/models/shared/types';
import { auth } from '@/auth';
import { ErrorType, ServerError } from '@/src/server/error';
import { IUser } from '@/models/IUser';
import { ILocationDto } from '@/models/Location';

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

export const saveLocationInUser = async (user: IUser, locationDto: ILocationDto) => {
  if (user.locations) {
    user.locations.push(locationDto._id);
  } else {
    user.locations = [locationDto._id];
  }
  await user.save();
};
