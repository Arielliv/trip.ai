'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { DevTool } from '@hookform/devtools';
import { TripsManagerContextObject, useManageTrips } from '@/app/hooks/useManageTrips';
import { useTripForm } from '@/app/hooks/useTripForm';
import { defaultTripContext } from '@/app/providers/TripContextFormProvider/defaultTripContextObject';
import { ManageLocationTableHook, useManageLocationTable } from '@/app/hooks/useManageLocationTable';
import { mapIFullTripToTripFormData } from '@/models/mappers/mapTripToFullTrip';
import { defaultLocationFormData } from '@/app/hooks/useLocationForm';
import { FormHandlers } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export const TripDataContext = createContext<TripsManagerContextObject & ManageLocationTableHook & FormHandlers>(
  defaultTripContext,
);

export const TripContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const manageTrips = useManageTrips();
  const { loadTrips, getFullTripById } = manageTrips;
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  const formMethods = useTripForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  const manageLocationTable = useManageLocationTable();
  const { loadTripLocations, clearTripLocations } = manageLocationTable;

  useEffect(() => {
    if (!tripId) return;

    const fetchDetails = async () => {
      if (!tripId) return;

      const trip = await getFullTripById(tripId);

      const formData = mapIFullTripToTripFormData(trip);
      loadTripLocations(formData?.locations || []);
      formMethods.reset({ ...formData });
    };

    fetchDetails();
  }, [tripId]);

  useEffect(() => {
    void handleFetchDetails();
  }, [handleFetchDetails]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (tripId) {
        setSnackbarMessage('Trip updated successfully!');
      } else {
        setSnackbarMessage('Trip saved successfully!');
      }
      setOpenSnackbar(true);
    }
  }, [isSubmitSuccessful, tripId]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    reset(defaultLocationFormData);
    clearTripLocations();
  }, [router, pathname, reset, clearTripLocations]);

  const contextValue = useMemo<TripsManagerContextObject & ManageLocationTableHook & FormHandlers>(
    () => ({
      ...manageTrips,
      ...manageLocationTable,
      isEditMode: Boolean(tripId),
      clearFormOnEditState,
    }),
    [clearFormOnEditState, manageLocationTable, manageTrips, tripId],
  );

  return (
    <TripDataContext.Provider value={contextValue}>
      <FormProvider {...formMethods}>
        <DevTool id="new-trip" placement="bottom-right" control={formMethods.control} />
        <form>{children}</form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </FormProvider>
    </TripDataContext.Provider>
  );
};

export const useTripContext = () => useContext(TripDataContext);
