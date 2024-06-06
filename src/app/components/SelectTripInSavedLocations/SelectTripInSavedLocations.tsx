import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useManageTrips } from '@/app/hooks/useManageTrips';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';
import { defaultTripId } from '@/app/components/constants/constants';

export const SelectTripInSavedLocations = () => {
  const { trips } = useManageTrips();
  const { setTripId } = useLocationContext();

  const handleSelectChange = async (event: SelectChangeEvent) => {
    setTripId(event.target.value);
  };

  return (
    <Box sx={{ m: 1 }}>
      <FormControl fullWidth>
        <InputLabel>Select Trip</InputLabel>
        <Select label="Select Trip" defaultValue={defaultTripId} onChange={handleSelectChange} fullWidth>
          <MenuItem value={defaultTripId}>All Trips</MenuItem>
          {trips.map((trip) => (
            <MenuItem key={trip._id} value={trip._id}>
              {trip.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
