import { useController } from 'react-hook-form';
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { ITrip } from '@/models/Trip';

export const SelectableCheckboxes = ({
  trips,
  defaultTripIds,
  control,
  name,
}: {
  defaultTripIds: string[];
  trips: ITrip[];
  control: any;
  name: string;
}) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = useState(field.value || []);

  return (
    <List>
      {trips.map((trip, index) => (
        <React.Fragment key={trip._id}>
          <ListItem>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  onChange={(e) => {
                    const valueCopy = [...value];

                    // update checkbox value
                    valueCopy[index] = e.target.checked ? e.target.value : null;

                    // send data to react hook form
                    field.onChange(valueCopy);

                    // update local state
                    setValue(valueCopy);
                  }}
                  checked={value.includes(trip._id) || defaultTripIds.includes(trip._id || '')}
                  value={trip._id}
                />
              }
              label={trip.name}
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
    </List>
  );
};
