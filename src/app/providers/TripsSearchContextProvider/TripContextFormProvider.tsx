'use client';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { SearchTripsContextObject, useSearchTrips } from '@/app/hooks/useSearchTrips';
import { defaultSearchTripsContext } from '@/app/providers/TripsSearchContextProvider/defaultTripsSearchContextObject';

export const TripsSearchContextData = createContext<SearchTripsContextObject>(defaultSearchTripsContext);

export const TripsSearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const searchTripsHandlers = useSearchTrips();
  const { loadTrips } = searchTripsHandlers;

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const contextValue = useMemo<SearchTripsContextObject>(
    () => ({
      ...searchTripsHandlers,
    }),
    [searchTripsHandlers],
  );

  return <TripsSearchContextData.Provider value={contextValue}>{children}</TripsSearchContextData.Provider>;
};

export const useTripsSearchContext = () => useContext(TripsSearchContextData);
