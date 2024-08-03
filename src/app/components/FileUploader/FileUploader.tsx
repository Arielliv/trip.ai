import React from 'react';
import { MuiFileInput } from 'mui-file-input';
import { useLocationFileController } from '@/app/hooks/formControllers/useLocationFileController';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const FileUploader = () => {
  const { field: locationFileField, error: locationFileError } = useLocationFileController();

  return (
    <MuiFileInput
      error={!!locationFileError}
      helperText={locationFileError?.message && 'Location file is invalid'}
      label="Upload file"
      clearIconButtonProps={{
        title: 'Remove',
        children: <CloseIcon fontSize="small" />,
      }}
      multiple
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AttachFileIcon />
          </InputAdornment>
        ),
      }}
      {...locationFileField}
    />
  );
};
