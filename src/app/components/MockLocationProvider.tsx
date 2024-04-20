// tests/utils/MockLocationProvider.js
import React from 'react';
import { LocationDataContext } from '../providers/LocationFormProvider/LocationContextFormProvider';

export const MockLocationProvider = ({ children, value }: React.PropsWithChildren & any) => {
  return <LocationDataContext.Provider value={value}>{children}</LocationDataContext.Provider>;
};
