import { getGooglePlaceIdAndAdditionalData } from '@/src/server/generateUtils';
import { LocationPermissionEnum } from '@/models/constants/constants';
import Location, { ILocationDto } from '@/models/Location';
import { saveLocationsInUser } from '@/src/server/userUtils';
import { ILocationInTrip } from '@/models/Trip';
import { IUser } from '@/models/IUser';

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
        return { ...location, connectedLocationData: { ...location.connectedLocationData, googlePlaceId, imageUrl } };
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
