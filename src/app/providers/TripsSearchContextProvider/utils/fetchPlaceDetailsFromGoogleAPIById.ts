export const fetchPlaceDetailsFromGoogleAPIById = (
  map: google.maps.Map,
  placeId: string,
): Promise<google.maps.places.PlaceResult | null> => {
  return new Promise((resolve, reject) => {
    if (!map) {
      reject(new Error('Map object is not available.'));
      return;
    }

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: [
          'name',
          'place_id',
          'formatted_address',
          'types',
          'geometry.location',
          'address_components',
          'url',
          'website',
          'photos',
        ],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(result);
        } else {
          reject(new Error('Failed to fetch place details: ' + status));
        }
      },
    );
  });
};
