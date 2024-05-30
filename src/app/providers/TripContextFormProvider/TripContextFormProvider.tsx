'use client';
import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { TripsManagerContextObject, useManageTrips } from '@/app/hooks/useManageTrips';
import { useTripForm } from '@/app/hooks/useTripForm';
import { defaultTripContext } from '@/app/providers/TripContextFormProvider/defaultTripContextObject';
import { ManageLocationTableHook, useManageLocationTable } from '@/app/hooks/useManageLocationTable';
import { mapFullTripToTripFormData } from '@/models/mappers/mapTripToFullTrip';
import { defaultLocationFormData } from '@/app/hooks/useLocationForm';
import { FormHandlers } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { useSnackbar } from 'notistack';
import { useGetFullTripById } from '@/app/hooks/useGetFullTripById';

export const TripDataContext = createContext<TripsManagerContextObject & ManageLocationTableHook & FormHandlers>(
  defaultTripContext,
);

export const TripContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();
  const manageTrips = useManageTrips();
  const { loadTrips, currentTripId } = manageTrips;
  const { getFullTripById } = useGetFullTripById();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  const formMethods = useTripForm();
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;
  const isEditMode = Boolean(tripId);

  const manageLocationTable = useManageLocationTable(formMethods.control);
  const { loadTripLocations, clearTripLocations } = manageLocationTable;

  useEffect(() => {
    if (!tripId) return;

    const fetchDetails = async () => {
      if (!tripId) return;

      const trip = await getFullTripById(tripId);

      const formData = mapFullTripToTripFormData(trip);
      loadTripLocations(formData?.locations || []);
      formMethods.reset({ ...formData });
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  useEffect(() => {
    let message;
    if (isSubmitSuccessful) {
      if (tripId || currentTripId) {
        message = 'Trip updated successfully!';
      } else {
        message = 'Trip saved successfully!';
      }
      enqueueSnackbar(message, { variant: 'success' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, isSubmitSuccessful, tripId]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    reset(defaultLocationFormData);
    clearTripLocations();
  }, [router, pathname, reset, clearTripLocations]);

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
