import React from 'react';
import { IUserPermission } from '@/models/shared/types';
import { LocationPermissionEnum } from '@/models/enums/permissionsEnums';
import { useSession } from 'next-auth/react';

interface permissionFilterProps extends React.PropsWithChildren {
  permissions: IUserPermission[];
  permissionLevel: LocationPermissionEnum;
}

export function LocationPermissionFilter({ permissions, permissionLevel, children }: permissionFilterProps) {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const userPermission = permissions.find((permission) => permission.userId.toString() === userId);

  if (!userPermission) {
    return;
  }

  if (userPermission?.permissionType >= permissionLevel) {
    return children;
  }
}
