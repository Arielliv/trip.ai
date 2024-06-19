import React from 'react';
import { IUserPermission } from '@/models/shared/types';
import { useSession } from 'next-auth/react';
import { LocationPermissionEnum } from '@/models/constants/constants';

interface LocationPermissionFilterProps extends React.PropsWithChildren {
  permissions: IUserPermission[];
  permissionLevel: LocationPermissionEnum;
}

export const LocationPermissionFilter = ({ permissions, permissionLevel, children }: LocationPermissionFilterProps) => {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const userPermission = permissions.find((permission) => permission.userId.toString() === userId);

  if (!userPermission) {
    return;
  }

  if (userPermission?.permissionType <= permissionLevel) {
    return children;
  }
};
