'use client';
import { defaultLocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useManageLocations } from '@/app/hooks/useManageLocations';
import { LocationContextObject, useLocationData } from '@/app/hooks/useLocationData';
import { ILocation } from '@/models/Location';

const defaultLocationContextObject: LocationContextObject = {
  mapCenter: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  autocomplete: undefined,
  place: {},
  currentMarker: undefined,
  onLoadAutocomplete: () => {},
  onAutoCompletePlaceChange: () => {},
  onAutoCompletePlaceEmpty: () => {},
  handleFocusLocation: (_coordinate) => {},
};

export interface SavedLocationsContextObject {
  locations: ILocation[];
  loadLocations: () => void;
  addLocation: (newLocation: ILocation) => void;
  loading: boolean;
  hasMore: boolean;
}

const defaultSavedLocationsContext: SavedLocationsContextObject = {
  locations: [],
  loadLocations: () => {},
  addLocation: (_newLocation: ILocation) => {},
  loading: false,
  hasMore: false,
};

// should be imported only for testing purposes
export const LocationDataContext = createContext<LocationContextObject & SavedLocationsContextObject>({
  ...defaultLocationContextObject,
  ...defaultSavedLocationsContext,
});

export const LocationContextFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useLocationForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;
  const { locations, loadLocations, loading, hasMore, addLocation } = useManageLocations();
  const locationData = useLocationData();

  // Load locations initially or when parameters change
  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultLocationFormData);
      setSnackbarMessage('Location saved successfully!');
      setOpenSnackbar(true);
    }
  }, [formMethods, isSubmitSuccessful, reset]);

  return (
    <LocationDataContext.Provider value={{ ...locationData, locations, loadLocations, loading, hasMore, addLocation }}>
      <FormProvider {...formMethods}>
        <DevTool id="new-location" placement="bottom-right" control={formMethods.control} />
        <form>{children}</form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </FormProvider>
    </LocationDataContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationDataContext);
