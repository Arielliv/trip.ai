'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { LocationsManagerContextObject, useManageLocations } from '@/app/hooks/useManageLocations';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { useLocationForm, defaultLocationFormData } from '@/app/hooks/useLocationForm';
import { defaultLocationContext } from '@/app/providers/LocationContextFormProvider/defaultLocationContextObject';
import { mapILocationToLocationFormData } from '@/models/mappers/mapILocationToLocationFormData';
import { fetchPlaceDetailsFromGoogleAPIById } from '@/app/providers/LocationContextFormProvider/utils/fetchPlaceDetailsFromGoogleAPIById';
import { DevTool } from '@hookform/devtools';

export interface FormHandlers {
  clearFormOnEditState(): void;
}

export const LocationDataContext = createContext<LocationContextObject & LocationsManagerContextObject & FormHandlers>(
  defaultLocationContext,
);

export const LocationContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useLocationForm();
  const manageLocations = useManageLocations();
  const { loadLocations, getLocationById } = manageLocations;
  const locationData = useLocationData(formMethods.control);
  const { handleFocusEditLocation } = locationData;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locationId = searchParams.get('id');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  const handleFetchDetails = useCallback(async () => {
    if (isSubmitSuccessful) return;
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
      if (locationId) {
        router.push(pathname);
        setSnackbarMessage('Location updated successfully!');
      } else {
        setSnackbarMessage('Location saved successfully!');
      }
      reset(defaultLocationFormData);
      setOpenSnackbar(true);
    }
  }, [reset, isSubmitSuccessful, locationId, router, pathname]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    reset(defaultLocationFormData);
  }, [router, pathname, reset]);

  const contextValue = useMemo<LocationContextObject & LocationsManagerContextObject & FormHandlers>(
    () => ({
      ...locationData,
      ...manageLocations,
      isEditMode: Boolean(locationId),
      clearFormOnEditState,
    }),
    [locationData, manageLocations, locationId, clearFormOnEditState],
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
