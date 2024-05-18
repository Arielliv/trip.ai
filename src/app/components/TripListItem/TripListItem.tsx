import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { DataTestIds } from '@/app/components/constants/constants';
import { getStringAvatar } from '@/app/utils/getStringAvatar';
import { DateView } from '@/app/components/LocationsTable/TableComponents/Date/DateView/DateView';
import { DateRange } from '@mui/x-date-pickers-pro';
import LocationCounter from '@/app/components/SavedTrips/LocationCounter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Divider from '@mui/material/Divider';
import React from 'react';
import { ITrip } from '@/models/Trip';
import Grid from '@mui/material/Unstable_Grid2';

export interface TripListItemProps {
  index: number;
  trip: ITrip;
  handleEdit: (id?: string) => void;
  handleDelete: (id?: string) => void;
  handleSelect: (id?: string) => void;
}

export const TripListItem = ({ index, trip, handleEdit, handleDelete, handleSelect }: TripListItemProps) => {
  return (
    <>
      <ListItem
        key={index}
        data-testid={DataTestIds.savedTripAt(index)}
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
            transition: 'background-color 0.3s ease',
          },
        }}
      >
        <ListItemAvatar>
          <Avatar {...getStringAvatar(trip?.name ?? '')} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Grid container padding={1} alignItems={'start'} direction="column">
              <Grid>
                <Typography component="div" variant="h6" color="text.primary">
                  {trip?.name ?? 'Default Trip Name'}
                </Typography>
              </Grid>
              <Grid container alignItems="center">
                <Typography component="span" variant="body1" color="text.secondary" sx={{ marginRight: 1 }}>
                  Dates:
                </Typography>
                <DateView
                  justifyContent={'start'}
                  color={'text.secondary'}
                  value={
                    trip.locations.length > 0
                      ? (trip?.locations[0]?.dateRange.map((date) => new Date(date)) as DateRange<Date>)
                      : [new Date(), new Date()]
                  }
                />
              </Grid>
            </Grid>
          }
          secondary={
            <Grid container>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary"></Typography>
              <LocationCounter value={trip?.locations.length} />
            </Grid>
          }
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1, alignItems: 'center' }}>
          <IconButton onClick={() => handleEdit(trip._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(trip._id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleSelect(trip._id)}>
            <VisibilityIcon />
          </IconButton>
        </Box>
      </ListItem>
      <Divider component="li" />
    </>
  );
};
