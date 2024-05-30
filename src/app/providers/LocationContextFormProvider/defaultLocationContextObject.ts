import { LocationContextObject } from '@/app/hooks/useLocationData';
import { ILocation } from '@/models/Location';
import { LocationsManagerContextObject } from '@/app/hooks/useManageLocations';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { LocationsPaginationResponse } from '@/lib/types';
import { SubmitHandler } from 'react-hook-form';
import { LocationFormData } from '@/app/hooks/useLocationForm';

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
  removeLocation: (_id: string) => {},
};

export const defaultLocationContext = {
  ...defaultLocationContextObject,
  ...defaultSavedLocationsContext,
  clearFormOnEditState: () => {},
  isEditMode: false,
};
