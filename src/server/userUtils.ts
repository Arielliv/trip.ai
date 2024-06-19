import { IUser } from '@/models/IUser';
import { ILocationDto } from '@/models/Location';

export const saveLocationInUser = async (user: IUser, locationDto: ILocationDto) => {
  if (user.locations) {
    const isExist = user.locations.findIndex((locationId) => locationId.equals(locationDto._id)) !== -1;
    if (!isExist) {
      user.locations.push(locationDto._id);
    }
  } else {
    user.locations = [locationDto._id];
  }
  await user.save();
};

export const saveLocationsInUser = async (user: IUser, locationsDto: ILocationDto[]) => {
  if (user.locations) {
    user.locations.concat(locationsDto.map((location) => location._id));
  } else {
    user.locations = locationsDto.map((location) => location._id);
  }
  await user.save();
};
