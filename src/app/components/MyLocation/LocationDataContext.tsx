import React, { createContext, useContext } from 'react';
import { LocationData, useLocationData } from '@/app/hooks/useLocationData';

const defaultLocationData: LocationData = {
  markers: [],
  mapCenter: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  autocomplete: undefined,
  place: {},
  currentMarker: undefined,
  onLoadAutocomplete: () => {},
  onPlaceChange: () => {},
};
// should be imported only for testing purposes
export const LocationDataContext = createContext<LocationData>(defaultLocationData);

export const LocationDataProvider = ({ children }: React.PropsWithChildren) => {
  const locationData = useLocationData();

  return <LocationDataContext.Provider value={locationData}>{children}</LocationDataContext.Provider>;
};

export const useLocationContext = () => useContext(LocationDataContext);
