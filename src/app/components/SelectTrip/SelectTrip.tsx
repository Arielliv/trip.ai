import React, { ReactNode } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useManageTrips } from '@/app/hooks/useManageTrips';

export interface SelectTripProps {
  onSelectChange: (event: SelectChangeEvent) => void;
  defaultSelectValue: () => string;
  renderSelectValue: (value: any) => string;
}

export const SelectTrip = ({ onSelectChange, defaultSelectValue, renderSelectValue }: SelectTripProps) => {
  const { trips } = useManageTrips();
  const defaultValue = defaultSelectValue();

  const renderValue = (selectedValue: any): string => {
    const value = renderSelectValue(selectedValue);
    const filteredTrips = trips.filter((trip) => trip?._id === value);
    return filteredTrips.length > 0 ? filteredTrips[0].name : value;
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Trip</InputLabel>
      <Select
        label="Select Trip"
        defaultValue={defaultValue}
        onChange={onSelectChange}
        renderValue={renderValue}
        fullWidth
      >
        <MenuItem value="None">None</MenuItem>
        {trips.map((trip) => (
          <MenuItem key={trip._id} value={trip._id}>
            {trip.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
