import { ILocation } from '@/models/Location';
import { LocationFormData } from '@/app/hooks/useLocationForm';
import { Visibility } from '@/models/constants';

export const mapILocationToLocationFormData = (location: ILocation | undefined): LocationFormData | undefined => {
  if (!location) {
    return;
  }
  return {
    locationName: location.name,
    note: location.note || '',
    locationType: location.type ? location.type.toString().toLowerCase() : 'general',
    privacy: location.visibility === Visibility.Public,
    place: null,
  };
};
