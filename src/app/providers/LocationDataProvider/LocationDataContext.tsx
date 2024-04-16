import React, { createContext, useContext } from 'react';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';

const defaultLocationContextObject: LocationContextObject = {
  markers: [],
  mapCenter: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  autocomplete: undefined,
  place: {},
  currentMarker: undefined,
  onLoadAutocomplete: () => {},
  onAutoCompletePlaceChange: () => {},
  onAutoCompletePlaceEmpty: () => {},
};
// should be imported only for testing purposes
export const LocationDataContext = createContext<LocationContextObject>(defaultLocationContextObject);

export const LocationDataProvider = ({ children }: React.PropsWithChildren) => {
  const locationData = useLocationData();

  return <LocationDataContext.Provider value={locationData}>{children}</LocationDataContext.Provider>;
};

export const useLocationContext = () => useContext(LocationDataContext);
