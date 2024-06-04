'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { SearchTripsContextObject, useSearchTrips } from '@/app/hooks/useSearchTrips';
import { defaultSearchTripsContext } from '@/app/providers/TripsSearchContextProvider/defaultTripsSearchContextObject';
import { ManageSearchQueryParamsObject, useManageSearchQueryParams } from '@/app/hooks/useManageSearchQueryParams';

export const TripsSearchContextData = createContext<SearchTripsContextObject & ManageSearchQueryParamsObject>(
  defaultSearchTripsContext,
);

export const TripsSearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const searchTripsHandlers = useSearchTrips();
  const manageSearchQueryParams = useManageSearchQueryParams(searchTripsHandlers.loadSearchedTrips);

  const contextValue = useMemo<SearchTripsContextObject & ManageSearchQueryParamsObject>(
    () => ({
      ...searchTripsHandlers,
      ...manageSearchQueryParams,
    }),
    [manageSearchQueryParams, searchTripsHandlers],
  );

  return <TripsSearchContextData.Provider value={contextValue}>{children}</TripsSearchContextData.Provider>;
};

export const useTripsSearchContext = () => useContext(TripsSearchContextData);
