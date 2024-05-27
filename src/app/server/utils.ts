import { IUserPermission } from '@/models/shared/types';

export function findUserPermissions(userId: string, permissions: IUserPermission[]): IUserPermission | undefined {
  return permissions.find((permissionObj) => permissionObj.userId.toString() === userId);
}
