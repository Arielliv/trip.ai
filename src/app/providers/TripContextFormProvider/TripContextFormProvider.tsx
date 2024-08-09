'use client';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { TripsManagerContextObject, useManageTrips } from '@/app/hooks/useManageTrips';
import { defaultTripFormData, useTripForm } from '@/app/hooks/forms/useTripForm';
import { defaultTripContext } from '@/app/providers/TripContextFormProvider/defaultTripContextObject';
import { ManageLocationTableHook, useManageLocationTable } from '@/app/hooks/useManageLocationTable';
import { mapFullTripToTripFormData } from '@/models/mappers/mapTripToFullTrip';
import { useGetFullTripById } from '@/app/hooks/query/useFetchTripById';
import { FormHandlers } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export const TripDataContext = createContext<TripsManagerContextObject & ManageLocationTableHook & FormHandlers>(
  defaultTripContext,
);

export const TripContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useTripForm();
  const router = useRouter();
  const pathname = usePathname();
  const manageTrips = useManageTrips(formMethods.reset);
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id') || undefined;

  const { reset } = formMethods;
  const isEditMode = Boolean(tripId);
  const manageLocationTable = useManageLocationTable(formMethods.control);
  const { loadTripLocationsIntoTable, clearTripLocationsFromTable } = manageLocationTable;

  const { data: fullTrip } = useGetFullTripById(tripId, isEditMode);

  useMemo(() => {
    if (fullTrip && isEditMode) {
      const formData = mapFullTripToTripFormData(fullTrip);
      loadTripLocationsIntoTable(formData!.locations || []);
      reset(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, fullTrip]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    manageTrips.setCurrentTripId(undefined);
    reset(defaultTripFormData);
    clearTripLocationsFromTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname, reset, clearTripLocationsFromTable]);

  const contextValue = useMemo<TripsManagerContextObject & ManageLocationTableHook & FormHandlers>(
    () => ({
      ...manageTrips,
      ...manageLocationTable,
      isEditMode,
      clearFormOnEditState,
    }),
    [clearFormOnEditState, isEditMode, manageLocationTable, manageTrips],
  );

  return (
    <TripDataContext.Provider value={contextValue}>
      <FormProvider {...formMethods}>
        <DevTool id="new-trip" placement="bottom-right" control={formMethods.control} />
        <form>{children}</form>
      </FormProvider>
    </TripDataContext.Provider>
  );
};

export const useTripContext = () => useContext(TripDataContext);
