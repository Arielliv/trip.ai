import React from 'react';
import { LocationDataContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export const MockLocationProvider = ({ children, value }: React.PropsWithChildren & any) => {
  return <LocationDataContext.Provider value={value}>{children}</LocationDataContext.Provider>;
};
