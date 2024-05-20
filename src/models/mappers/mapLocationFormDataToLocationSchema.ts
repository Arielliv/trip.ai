import { ILocation } from '@/models/Location';
import { LocationType, Visibility } from '@/models/constants';
import { LocationFormData } from '@/app/hooks/useLocationForm';

export const mapStringTypeToEnumType = (type: string) => {
  switch (type) {
    case 'general':
      return LocationType.General;
    case 'hotel':
      return LocationType.Hotel;
    case 'restaurant':
      return LocationType.Restaurant;
    default:
      return LocationType.General;
  }
};

export const mapLocationFormDataToLocationSchema = (locationFormData: LocationFormData): ILocation => {
  return {
    _id: locationFormData._id,
    name: locationFormData.locationName,
    trips: [],
    googleName: locationFormData.place?.name || '',
    note: locationFormData.note,
    type: mapStringTypeToEnumType(locationFormData.locationType),
    googlePlaceId: locationFormData.place?.place_id || '',
    formattedAddress: locationFormData.place?.formatted_address || '',
    placeTypes: locationFormData.place?.types,
    coordinates: {
      latitude: locationFormData.place?.geometry?.location?.lat() || 0,
      longitude: locationFormData.place?.geometry?.location?.lng() || 0,
    },
    address: {
      street: '',
      city:
        locationFormData.place?.address_components?.find((ac: google.maps.GeocoderAddressComponent) =>
          ac.types.includes('locality'),
        )?.long_name || '',
      state:
        locationFormData.place?.address_components?.find((ac: google.maps.GeocoderAddressComponent) =>
          ac.types.includes('administrative_area_level_1'),
        )?.short_name || '',
      country:
        locationFormData.place?.address_components?.find((ac: google.maps.GeocoderAddressComponent) =>
          ac.types.includes('country'),
        )?.long_name || '',
      postalCode:
        locationFormData.place?.address_components?.find((ac: google.maps.GeocoderAddressComponent) =>
          ac.types.includes('postal_code'),
        )?.long_name || '',
    },
    visibility: locationFormData.privacy ? Visibility.Public : Visibility.Private,
    mapsUrl: locationFormData.place?.url,
    links: [locationFormData.place?.website!].filter((link) => link),
    imageUrl: locationFormData.place?.photos?.[0]?.getUrl({ maxWidth: 1000, maxHeight: 1000 }) ?? '',
  };
};
