import { getGooglePlaceIdAndAdditionalData } from '@/src/server/generateUtils';
import { LocationPermissionEnum } from '@/models/constants/constants';
import Location, { ILocationDto } from '@/models/Location';
import { saveLocationsInUser } from '@/src/server/userUtils';
import { ILocationInTrip } from '@/models/Trip';
import { IUser } from '@/models/IUser';
import { LocationType } from '@/models/constants';

export const bulkCreateLocations = async (
  locations: ILocationInTrip[],
  owner_id: string,
  user: IUser,
): Promise<ILocationInTrip[]> => {
  await Promise.all(
    locations.map(async (location) => {
      if (location.connectedLocationData) {
        const { googlePlaceId, imageUrl } = await getGooglePlaceIdAndAdditionalData(
          location.connectedLocationData.formattedAddress,
        );
        location.connectedLocationData.imageUrl = imageUrl;
        location.connectedLocationData.googlePlaceId = googlePlaceId;
        location.connectedLocationData.type = getLocationType(location.connectedLocationData.type);
        return {
          ...location,
          connectedLocationData: {
            ...location.connectedLocationData,
            googlePlaceId,
            imageUrl,
            type: getLocationType(location.connectedLocationData.type),
          },
        };
      }
    }),
  );

  const locationsData = locations.map((location) => ({
    ...location.connectedLocationData,
    user_id: owner_id,
    permissions: [{ userId: owner_id, permissionType: LocationPermissionEnum.edit }],
  }));

  const newLocations: ILocationDto[] = await Location.insertMany(locationsData);

  const newLocationsResults = locations.map((location, index) => ({
    ...location,
    location_id: newLocations[index]._id,
    id: newLocations[index]._id,
    connectedLocationData: newLocations[index],
  }));

  await saveLocationsInUser(
    user,
    newLocationsResults.map((location) => location.connectedLocationData),
  );

  return newLocationsResults as unknown as ILocationInTrip[];
};

const getLocationType = (type?: string): LocationType => {
  if (!type) {
    return LocationType.General;
  }
  switch (type) {
    case 'restaurant':
      return LocationType.Restaurant;
    case 'hotel':
      return LocationType.Hotel;
    default:
      return LocationType.General;
  }
};
