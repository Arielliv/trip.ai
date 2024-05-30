'use client';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { SearchTripsContextObject, useSearchTrips } from '@/app/hooks/useSearchTrips';
import { defaultSearchTripsContext } from '@/app/providers/TripsSearchContextProvider/defaultTripsSearchContextObject';
import { useInfiniteSearchedTrips } from '@/app/hooks/query/useInfiniteSearchedTrips';

export const TripsSearchContextData = createContext<SearchTripsContextObject>(defaultSearchTripsContext);

export const TripsSearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const searchTripsHandlers = useSearchTrips();

  const contextValue = useMemo<SearchTripsContextObject>(
    () => ({
      ...searchTripsHandlers,
    }),
    [searchTripsHandlers],
  );

  return <TripsSearchContextData.Provider value={contextValue}>{children}</TripsSearchContextData.Provider>;
};

export const useTripsSearchContext = () => useContext(TripsSearchContextData);
