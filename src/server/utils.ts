import { IUserPermission } from '@/models/shared/types';
import { auth } from '@/auth';
import { ErrorType, ServerError } from '@/src/server/error';
import User, { IUser } from '@/models/IUser';
import Location, { ILocationDto } from '@/models/Location';
import { ObjectId } from 'mongodb';
import { LocationType } from '@/models/constants';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/constants/constants';
import { saveLocationInUser } from '@/src/server/userUtils';

export function findUserPermissions(userId: string, permissions: IUserPermission[]): IUserPermission | undefined {
  return permissions.find((permissionObj) => permissionObj.userId.toString() === userId);
}

export const getUserById = async (userId: string) => {
  const user: IUser | null = await User.findById<IUser>(userId);

  if (!user) {
    throw new ServerError('User not found', ErrorType.NotFoundError);
  } else {
    return user;
  }
};

export const authAndGetUserId = async () => {
  const session = await auth();
  console.log('session od me', session);
  if (!session || !session.user || !session.user.id) {
    throw new ServerError('User Authentication failed', ErrorType.AuthenticationError);
  }
  const user = session.user;
  if (!user?.id) {
    throw new ServerError('Tried to fetch user id from empty session', ErrorType.NullPointerError);
  }
  return user.id;
};

export const saveTripIdInManyUsers = async (userIds: ObjectId[] | undefined, tripId: string | undefined) => {
  if (!userIds || !tripId) throw new ServerError('Argument were sent null', ErrorType.NullPointerError);
  await User.updateMany(
    {
      _id: { $in: userIds },
      trips: { $nin: [tripId] },
    },
    {
      $addToSet: { trips: tripId },
    },
  );
};

export const updateLocationsTripsArray = async (
  locationsToAdd: ObjectId[],
  locationsToRemove: ObjectId[],
  tripId: ObjectId | null,
) => {
  if (!tripId) {
    throw new ServerError(
      'Tried to add trip id to each new location on trip but trip id was null',
      ErrorType.IllegalArgumentError,
    );
  }

  if (locationsToAdd.length > 0) {
    await Location.updateMany(
      { _id: { $in: locationsToAdd } },
      {
        $addToSet: { trips: tripId },
      },
    );
  }

  if (locationsToRemove.length > 0) {
    await Location.updateMany({ _id: { $in: locationsToRemove } }, { $pull: { trips: tripId } });
  }
};

export const updateLocationsPermissions = async (
  locationsToAdd: ObjectId[],
  tripPermissions: IUserPermission[] | undefined,
) => {
  if (tripPermissions) {
    for (const tripPermission of tripPermissions) {
      await updateLocationAndUserByTripPermission(tripPermission, locationsToAdd);
    }
  } else {
    throw new ServerError('Trip cannot exists without permission', ErrorType.RuntimeError);
  }
};

const updateLocationAndUserByTripPermission = async (
  userPermissionOnTrip: IUserPermission,
  locationToAdd: ObjectId[],
) => {
  const user = await User.findById(userPermissionOnTrip.userId);

  for (const location of locationToAdd) {
    const locationFromDb: ILocationDto | null = await Location.findById(location._id);

    if (!locationFromDb) {
      throw Error('Location was not found in db will trying to update');
    }

    const userPermissionOnLocationIndex = locationFromDb.permissions.findIndex((permission) => {
      return permission.userId.toString() === userPermissionOnTrip.userId.toString();
    });

    let permissionTypeToSave;

    if (userPermissionOnLocationIndex === -1) {
      permissionTypeToSave = getLocationPermissionByTripPermission(userPermissionOnTrip, locationFromDb.type);

      if (permissionTypeToSave) {
        if (locationFromDb.permissions) {
          locationFromDb.permissions.push({
            userId: userPermissionOnTrip.userId,
            permissionType: permissionTypeToSave,
          });
        } else {
          locationFromDb.permissions = [
            {
              userId: userPermissionOnTrip.userId,
              permissionType: permissionTypeToSave,
            },
          ];
        }

        await locationFromDb.save();
        await saveLocationInUser(user, locationFromDb);
      }
    } else {
      permissionTypeToSave = getLocationPermissionByTripPermission(userPermissionOnTrip, locationFromDb.type);
      const currentPermissionType = locationFromDb.permissions[userPermissionOnLocationIndex].permissionType;

      if (permissionTypeToSave) {
        locationFromDb.permissions[userPermissionOnLocationIndex].permissionType =
          permissionTypeToSave <= currentPermissionType ? permissionTypeToSave : currentPermissionType;

        await locationFromDb.save();
        await saveLocationInUser(user, locationFromDb);
      }
    }
  }
};

const getLocationPermissionByTripPermission = (
  userPermissionOnTrip: IUserPermission,
  locationType: LocationType | undefined,
): LocationPermissionEnum | undefined => {
  let permissionType;

  if (userPermissionOnTrip.permissionType <= TripPermissionEnum.EditBasic) {
    permissionType = LocationPermissionEnum.edit;
  } else if (userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewFullTrip) {
    permissionType = LocationPermissionEnum.view;
  } else if (
    (userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewHotels && locationType === LocationType.Hotel) ||
    locationType === LocationType.General
  ) {
    permissionType = LocationPermissionEnum.view;
  } else if (
    userPermissionOnTrip.permissionType <= TripPermissionEnum.ViewBasic &&
    locationType !== LocationType.Hotel &&
    locationType !== LocationType.Restaurant
  ) {
    permissionType = LocationPermissionEnum.view;
  }

  if (!permissionType) {
    return;
  }

  return permissionType;
};
