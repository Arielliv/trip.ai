import { LocationContextObject } from '@/app/hooks/useLocationData';
import { ILocation } from '@/models/Location';
import { LocationsManagerContextObject } from '@/app/hooks/useManageLocations';

const defaultLocationContextObject: LocationContextObject = {
  mapCenter: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  autocomplete: undefined,
  place: {},
  currentMarker: undefined,
  setMap: (_map) => {},
  map: null,
  onLoadAutocomplete: () => {},
  onAutoCompletePlaceChange: () => {},
  onAutoCompletePlaceEmpty: () => {},
  handleFocusLocation: (_coordinate) => {},
  handleFocusEditLocation: (_M, _n) => {},
};

const defaultSavedLocationsContext: LocationsManagerContextObject = {
  locations: [],
  loadLocations: () => {},
  addLocation: (_newLocation: ILocation) => {},
  editLocation: (_updatedLocation: ILocation) => {},
  removeLocation: (_id: string) => Promise.resolve(),
  isEditMode: false,
  loading: false,
  hasMore: false,
};

export const defaultLocationContext = {
  ...defaultLocationContextObject,
  ...defaultSavedLocationsContext,
  clearFormOnEditState: () => {},
};
