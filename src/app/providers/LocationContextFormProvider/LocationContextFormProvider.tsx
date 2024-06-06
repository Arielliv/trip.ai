'use client';
import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { LocationsManagerContextObject, useManageLocations } from '@/app/hooks/useManageLocations';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { useLocationForm, defaultLocationFormData, LocationFormData } from '@/app/hooks/useLocationForm';
import { defaultLocationContext } from '@/app/providers/LocationContextFormProvider/defaultLocationContextObject';
import { mapILocationToLocationFormData } from '@/models/mappers/mapILocationToLocationFormData';
import { fetchPlaceDetailsFromGoogleAPIById } from '@/app/providers/LocationContextFormProvider/utils/fetchPlaceDetailsFromGoogleAPIById';
import { DevTool } from '@hookform/devtools';
import { ManageTripIdQueryParamObject, useManageTripIdQueryParam } from '@/app/hooks/useManageTripIdQueryParam';

export interface FormHandlers {
  clearFormOnEditState(): void;
  isEditMode: boolean;
}

export const LocationDataContext = createContext<
  LocationContextObject & LocationsManagerContextObject & FormHandlers & ManageTripIdQueryParamObject
>(defaultLocationContext);

export const LocationContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useLocationForm();
  const manageLocations = useManageLocations();
  const { getLocationById } = manageLocations;
  const locationData = useLocationData(formMethods.control);
  const { handleFocusEditLocation } = locationData;
  const searchParams = useSearchParams();
  const manageTripIdQueryParam = useManageTripIdQueryParam(manageLocations.loadLocationsByTripId);
  const router = useRouter();
  const pathname = usePathname();
  const locationId = searchParams.get('id');
  const isEditMode = Boolean(locationId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, getLocationById, locationData.map, formMethods]);

  useEffect(() => {
    void handleFetchDetails();
  }, [handleFetchDetails]);

  const clearFormOnEditState = useCallback(async () => {
    router.push(pathname);
    reset(defaultLocationFormData);
  }, [router, pathname, reset]);

  const contextValue = useMemo<
    LocationContextObject & LocationsManagerContextObject & FormHandlers & ManageTripIdQueryParamObject
  >(
    () => ({
      ...locationData,
      ...manageLocations,
      ...manageTripIdQueryParam,
      isEditMode,
      clearFormOnEditState,
    }),
    [locationData, manageLocations, manageTripIdQueryParam, isEditMode, clearFormOnEditState],
  );

  return (
    <LocationDataContext.Provider value={contextValue}>
      <FormProvider {...formMethods}>
        <DevTool id={'new-location'} placement={'bottom-right'} control={formMethods.control} />
        <form>{children}</form>
      </FormProvider>
    </LocationDataContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationDataContext);
