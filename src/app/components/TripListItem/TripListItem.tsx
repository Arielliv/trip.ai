import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { DataTestIds } from '@/app/components/constants/constants';
import { getStringAvatar } from '@/app/utils/getStringAvatar';
import { DateView } from '@/app/components/LocationsTable/TableComponents/Date/DateView/DateView';
import { DateRange } from '@mui/x-date-pickers-pro';
import LocationCounter from '@/app/components/SavedTrips/LocationCounter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import { ITrip } from '@/models/Trip';
import Grid from '@mui/material/Unstable_Grid2';
import { TripMiniViewDialog } from '@/app/components/Dialogs/TripMiniViewDialog/TripMiniViewDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface TripListItemProps {
  index: number;
  trip: ITrip;
  handleEdit: (id?: string) => void;
  handleDelete: (id?: string) => void;
  handleSelect: (id?: string) => void;
}

export const TripListItem = ({ index, trip, handleEdit, handleDelete, handleSelect }: TripListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
        <Grid container padding={1} direction="row">
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
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                ></Typography>
                <LocationCounter value={trip?.locations.length} />
              </Grid>
            }
          />
          <ListItemIcon>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1, alignItems: 'center' }}>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleOpen}>Show trip view</MenuItem>
              </Menu>
            </Box>
          </ListItemIcon>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1, alignItems: 'center' }}>
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
        </Grid>
      </ListItem>
      <Divider component="li" />
      {isOpen && <TripMiniViewDialog tripId={trip._id || ''} isOpen={isOpen} handleClose={handleClose} />}
    </>
  );
};
