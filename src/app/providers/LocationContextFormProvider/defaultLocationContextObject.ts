import { LocationContextObject } from '@/app/hooks/useLocationData';
import { ILocation } from '@/models/Location';
import { LocationsManagerContextObject } from '@/app/hooks/useManageLocations';
import { ManageTripIdQueryParamObject } from '@/app/hooks/useManageTripIdQueryParam';

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
  addLocation: (_newLocation: ILocation) => {},
  editLocation: (_updatedLocation: ILocation) => {},
  isLoading: false,
  hasNextPage: false,
  loadLocationsByTripId: (_id?: string) => {},
  removeLocation: (_id: string) => {},
};

const defaultManageTripIdQueryParamObject: ManageTripIdQueryParamObject = {
  tripId: undefined,
  locationId: undefined,
  setTripId: (_newTripId: string) => {},
  setLocationId: (_locationId: string) => {},
};

export const defaultLocationContext = {
  ...defaultLocationContextObject,
  ...defaultSavedLocationsContext,
  ...defaultManageTripIdQueryParamObject,
  clearFormOnEditState: () => {},
  isEditMode: false,
};
