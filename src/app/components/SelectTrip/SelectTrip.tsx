import React, { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useManageTrips } from '@/app/hooks/useManageTrips';

export interface SelectTripProps {
  onSelectChange: (id?: string) => void;
}

export const SelectTrip = ({ onSelectChange }: SelectTripProps) => {
  const { trips, loadTrips } = useManageTrips();

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const selectedTripName = event.target.value;
    const selectedTrip = trips.find((trip) => trip.name === selectedTripName);
    const selectedTripId = selectedTrip ? selectedTrip._id : undefined;
    onSelectChange(selectedTripId);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Trip</InputLabel>
      <Select label="Select Trip" defaultValue="None" onChange={handleSelectChange} fullWidth>
        <MenuItem value="None">None</MenuItem>
        {trips.map((trip) => (
          <MenuItem key={trip._id} value={trip.name}>
            {trip.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
