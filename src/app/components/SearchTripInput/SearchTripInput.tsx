import { InputAdornment, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

export interface SearchTripInputProps {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchTripInput = ({ onInputChange }: SearchTripInputProps) => {
  return (
    <TextField
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
