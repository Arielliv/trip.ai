export const DataTestIds = {
  tripContainer: 'trip-container',
  googleMap: 'google-map',
  focusMarker: 'focus-marker',
  marker: 'marker',
  savedTripAt: (index: number) => getDataTestIdWithIndex('saved-trip', index),
  customizedTabAt: (dataTestPrefix: string, index: number) => getDataTestIdWithIndex(dataTestPrefix, index),
};

export const getDataTestIdWithIndex = (dataTestId: string, ...indices: any[]) => {
  const indexString = indices.join('-');
  return `${dataTestId}-${indexString}`;
};

export enum MyLocationDataTestIds {
  locationTabsContainer = 'location-tabs-container',
  mapContainer = 'map-container',
}

export enum Columns {
  Id = 'id',
  LocationName = 'Location Name',
  Duration = 'Duration',
  Date = 'Date',
  AdditionalInfo = 'Additional Info',
  Cost = 'Cost',
  Type = 'Type',
}
