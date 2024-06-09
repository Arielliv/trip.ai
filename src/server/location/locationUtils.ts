import { IUser } from '@/models/IUser';
import { ILocationDto } from '@/models/Location';

export const saveLocationInUser = async (user: IUser, locationDto: ILocationDto) => {
  if (user.locations) {
    user.locations.push(locationDto._id);
  } else {
    user.locations = [locationDto._id];
  }
  await user.save();
};
