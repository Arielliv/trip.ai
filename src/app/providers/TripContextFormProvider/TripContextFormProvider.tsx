'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { DevTool } from '@hookform/devtools';
import { TripContextObject, useTripData } from '@/app/hooks/useTripData';
import { TripsManagerContextObject, useManageTrips } from '@/app/hooks/useManageTrips';
import { defaultTripFormData, useTripForm } from '@/app/hooks/useTripForm';
import { mapITripToTripFormData } from '@/models/mappers/mapITripToTripFormData';
import { defaultTripContext } from '@/app/providers/TripContextFormProvider/defaultTripContextObject';

export const TripDataContext = createContext<TripContextObject & TripsManagerContextObject>(defaultTripContext);

export const TripContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const manageTrips = useManageTrips();
  const { loadTrips, getTripById } = manageTrips;
  const tripData = useTripData();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  const formMethods = useTripForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  const handleFetchDetails = useCallback(async () => {
    if (!tripId) return;

    const trip = getTripById(tripId);

    const formData = mapITripToTripFormData(trip);
    formMethods.reset({ ...formData });
  }, [tripId, getTripById, formMethods]);

  useEffect(() => {
    void handleFetchDetails();
  }, [handleFetchDetails]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultTripFormData);
      setSnackbarMessage('Trip saved successfully!');
      setOpenSnackbar(true);
    }
  }, [reset, isSubmitSuccessful]);

  const contextValue = useMemo<TripContextObject & TripsManagerContextObject>(
    () => ({
      ...tripData,
      ...manageTrips,
      isEditMode: Boolean(tripId),
    }),
    [tripData, manageTrips, tripId],
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
