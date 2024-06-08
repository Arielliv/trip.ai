import { ILocation } from '@/models/Location';
import { LocationFormData } from '@/app/hooks/useLocationForm';

export const mapILocationToLocationFormData = (location: ILocation | undefined): LocationFormData | undefined => {
  if (!location) {
    return;
  }
  return {
    _id: location._id || '',
    locationName: location.name,
    note: location.note || '',
    locationType: location.type ? location.type.toString().toLowerCase() : 'general',
    place: null,
  };
};
