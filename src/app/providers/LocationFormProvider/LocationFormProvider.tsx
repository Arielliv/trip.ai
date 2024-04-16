'use client';
import { defaultLocationFormData, useLocationForm } from '@/app/hooks/useLocationForm';
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import React, { useEffect } from 'react';

export const LocationFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useLocationForm();

  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultLocationFormData);
    }
  }, [formMethods, isSubmitSuccessful, reset]);

  return (
    <FormProvider {...formMethods}>
      <DevTool id="new-location" placement="bottom-right" control={formMethods.control} />
      <form>{children}</form>
    </FormProvider>
  );
};
