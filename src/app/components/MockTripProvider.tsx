import React from 'react';
import { TripDataContext } from '../providers/TripContextFormProvider/TripContextFormProvider';

export const MockTripProvider = ({ children, value }: React.PropsWithChildren & any) => {
  return <TripDataContext.Provider value={value}>{children}</TripDataContext.Provider>;
};
