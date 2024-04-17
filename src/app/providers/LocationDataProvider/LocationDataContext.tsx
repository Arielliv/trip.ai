import React, { createContext, useContext, useEffect } from 'react';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { useFetchLocations } from '@/app/hooks/useFetchLocations';
import { ILocation } from '@/models/Location';

const defaultLocationContextObject: LocationContextObject = {
  mapCenter: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  autocomplete: undefined,
  place: {},
  currentMarker: undefined,
  onLoadAutocomplete: () => {},
  onAutoCompletePlaceChange: () => {},
  onAutoCompletePlaceEmpty: () => {},
};

export interface SavedLocationsContextObject {
  locations: ILocation[];
  loadLocations: () => void;
  addLocation: (newLocation: ILocation) => void;
  loading: boolean;
  hasMore: boolean;
}

const defaultSavedLocationsContext: SavedLocationsContextObject = {
  locations: [],
  loadLocations: () => {},
  addLocation: (_newLocation: ILocation) => {},
  loading: false,
  hasMore: false,
};
// should be imported only for testing purposes
export const LocationDataContext = createContext<LocationContextObject & SavedLocationsContextObject>({
  ...defaultLocationContextObject,
  ...defaultSavedLocationsContext,
});

export const LocationDataProvider = ({ children }: React.PropsWithChildren) => {
  const locationData = useLocationData();
  const { locations, loadLocations, loading, hasMore, addLocation } = useFetchLocations();

  // Load locations initially or when parameters change
  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  return (
    <LocationDataContext.Provider value={{ ...locationData, locations, loadLocations, loading, hasMore, addLocation }}>
      {children}
    </LocationDataContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationDataContext);
