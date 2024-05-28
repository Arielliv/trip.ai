'use client';
import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { LocationsManagerContextObject, useManageLocations } from '@/app/hooks/useManageLocations';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { useLocationForm, defaultLocationFormData } from '@/app/hooks/useLocationForm';
import { defaultLocationContext } from '@/app/providers/LocationContextFormProvider/defaultLocationContextObject';
import { mapILocationToLocationFormData } from '@/models/mappers/mapILocationToLocationFormData';
import { fetchPlaceDetailsFromGoogleAPIById } from '@/app/providers/LocationContextFormProvider/utils/fetchPlaceDetailsFromGoogleAPIById';
import { DevTool } from '@hookform/devtools';
import { AxiosError } from 'axios';
import { useOnLocationFormSubmit } from '@/app/hooks/useOnLocationFormSubmit';
import { useSnackbar } from 'notistack';

export interface FormHandlers {
  clearFormOnEditState(): void;
}

export const LocationDataContext = createContext<LocationContextObject & LocationsManagerContextObject & FormHandlers>(
  defaultLocationContext,
);

export const LocationContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const formMethods = useLocationForm();
  const manageLocations = useManageLocations();
  const { loadLocations, getLocationById } = manageLocations;
  const locationData = useLocationData(formMethods.control);
  const { handleFocusEditLocation } = locationData;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locationId = searchParams.get('id');
  const isEditMode = Boolean(locationId);
  const {
    reset,
    formState: { isSubmitSuccessful },
    handleSubmit,
  } = formMethods;
  const { onSubmit } = useOnLocationFormSubmit({
    editLocation: manageLocations.editLocation,
    addLocation: manageLocations.addLocation,
    isEditMode,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, getLocationById, locationData.map, formMethods]);

  useEffect(() => {
    void handleFetchDetails();
  }, [handleFetchDetails]);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    let message;
    if (isSubmitSuccessful) {
      if (locationId) {
        router.push(pathname);
        message = 'Location updated successfully!';
      } else {
        message = 'Location saved successfully!';
      }
      reset(defaultLocationFormData);
      enqueueSnackbar(message, { variant: 'success' });
    }
  }, [reset, isSubmitSuccessful, locationId, router, pathname, enqueueSnackbar]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    reset(defaultLocationFormData);
  }, [router, pathname, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      await handleSubmit(onSubmit)(data);
    } catch (error: unknown) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      }
      if (error instanceof AxiosError) {
        message = error?.response?.data?.message || 'Unknown error';
      }
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const contextValue = useMemo<LocationContextObject & LocationsManagerContextObject & FormHandlers>(
    () => ({
      ...locationData,
      ...manageLocations,
      isEditMode,
      clearFormOnEditState,
    }),
    [locationData, manageLocations, isEditMode, clearFormOnEditState],
  );

  return (
    <LocationDataContext.Provider value={contextValue}>
      <FormProvider {...formMethods}>
        <DevTool id={'new-location'} placement={'bottom-right'} control={formMethods.control} />
        <form id={'location-form'} onSubmit={handleFormSubmit}>
          {children}
        </form>
      </FormProvider>
    </LocationDataContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationDataContext);
