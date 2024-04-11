// tests/utils/MockLocationProvider.js
import React from 'react';
import { LocationDataContext } from '../../MyLocation/LocationDataContext';

export const MockLocationProvider = ({ children, value }: React.PropsWithChildren & any) => {
  return <LocationDataContext.Provider value={value}>{children}</LocationDataContext.Provider>;
};
