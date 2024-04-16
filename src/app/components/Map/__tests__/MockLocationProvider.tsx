// tests/utils/MockLocationProvider.js
import { LocationDataContext } from '@/src/app/providers/LocationDataProvider/LocationDataContext';
import React from 'react';

export const MockLocationProvider = ({ children, value }: React.PropsWithChildren & any) => {
  return <LocationDataContext.Provider value={value}>{children}</LocationDataContext.Provider>;
};
