import { InputAdornment, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

export interface SearchTripInputProps {
  value?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchTripInput = ({ onInputChange, value }: SearchTripInputProps) => {
  return (
    <TextField
      value={value || ''}
      fullWidth
      onChange={onInputChange}
      placeholder="Search for trips..."
      label="Search Trips"
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
