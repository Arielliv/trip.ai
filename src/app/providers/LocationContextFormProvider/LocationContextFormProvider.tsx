'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { LocationsManagerContextObject, useManageLocations } from '@/app/hooks/useManageLocations';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { useLocationForm, defaultLocationFormData } from '@/app/hooks/useLocationForm';
import { defaultLocationContext } from '@/app/providers/LocationContextFormProvider/defaultLocationContextObject';
import { mapILocationToLocationFormData } from '@/models/mappers/mapILocationToLocationFormData';
import { fetchPlaceDetailsFromGoogleAPIById } from '@/app/providers/LocationContextFormProvider/utils/fetchPlaceDetailsFromGoogleAPIById';
import { DevTool } from '@hookform/devtools';

export const LocationDataContext = createContext<LocationContextObject & LocationsManagerContextObject>(
  defaultLocationContext,
);

export const LocationContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const manageLocations = useManageLocations();
  const { loadLocations, getLocationById } = manageLocations;
  const locationData = useLocationData();
  const { handleFocusEditLocation } = locationData;
  const searchParams = useSearchParams();
  const locationId = searchParams.get('id');
  const formMethods = useLocationForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  const handleFetchDetails = useCallback(async () => {
    if (!locationId) return;

    const location = getLocationById(locationId);
    if (!location || !location.googlePlaceId || !locationData.map) {
      console.log('Required data is missing');
      return;
    }

    try {
      const place = await fetchPlaceDetailsFromGoogleAPIById(locationData.map, location.googlePlaceId);
      const formData = mapILocationToLocationFormData(location);
      formMethods.reset({ ...formData, place });
      handleFocusEditLocation(
        {
          id: place?.place_id || '',
          lat: place?.geometry?.location?.lat() || 0,
          lng: place?.geometry?.location?.lat() || 0,
        },
        15,
      );
    } catch (error) {
      console.error('Failed to fetch place details:', error);
    }
  }, [locationId, getLocationById, locationData.map, formMethods]);

  useEffect(() => {
    void handleFetchDetails();
  }, [handleFetchDetails]);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultLocationFormData);
      setSnackbarMessage('Location saved successfully!');
      setOpenSnackbar(true);
    }
  }, [reset, isSubmitSuccessful]);

  const contextValue = useMemo<LocationContextObject & LocationsManagerContextObject>(
    () => ({
      ...locationData,
      ...manageLocations,
      isEditMode: Boolean(locationId),
    }),
    [locationData, manageLocations, locationId],
  );

  return (
    <LocationDataContext.Provider value={contextValue}>
      <FormProvider {...formMethods}>
        <DevTool id="new-location" placement="bottom-right" control={formMethods.control} />
        <form>{children}</form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </FormProvider>
    </LocationDataContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationDataContext);
