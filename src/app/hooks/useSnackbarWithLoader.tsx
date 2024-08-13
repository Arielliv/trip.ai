import { useSnackbar, SnackbarKey } from 'notistack';
import { useState } from 'react';
import { SnackbarContentWithLoader } from '../components/SnackbarWithLoader/SnackbarContentWithLoader';

export const useSnackbarWithMultipleLoaders = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackbarKeys, setSnackbarKeys] = useState<Record<string, SnackbarKey | null>>({});

  const showSnackbarWithLoader = (id: string, message: string) => {
    const key = enqueueSnackbar(<SnackbarContentWithLoader message={message} />, {
      variant: 'info',
      persist: true,
    });
    setSnackbarKeys((prevKeys) => ({ ...prevKeys, [id]: key }));
  };

  const closeSnackbarById = (id: string) => {
    const key = snackbarKeys[id];
    if (key !== null) {
      closeSnackbar(key);
      setSnackbarKeys((prevKeys) => ({ ...prevKeys, [id]: null }));
    }
  };

  return { showSnackbarWithLoader, closeSnackbarById, enqueueSnackbar };
};
