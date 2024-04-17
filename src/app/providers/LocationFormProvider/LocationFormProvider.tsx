'use client';
import { defaultLocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export const LocationFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useLocationForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

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
    <FormProvider {...formMethods}>
      <DevTool id="new-location" placement="bottom-right" control={formMethods.control} />
      <form>{children}</form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
};
