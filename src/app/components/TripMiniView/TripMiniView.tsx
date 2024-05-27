import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { ITrip } from '@/models/Trip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateRange } from '@mui/x-date-pickers-pro';

export interface TripMiniViewProps {
  trip: ITrip;
  handleClose: () => void;
  isOpen: boolean;
}

export const TripMiniView = ({ trip, handleClose, isOpen }: TripMiniViewProps) => {
  const dateDuration =
    trip.locations.length > 0
      ? (trip?.locations[0]?.dateRange.map((date) => new Date(date)) as DateRange<Date>)
      : [new Date(), new Date()];
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">{trip.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Participants: {trip.participants_ids.length} - Visibility: {trip.visibility}
        </DialogContentText>
        {trip.locations.map((location, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <Typography>{location.connectedLocationData?.name || 'Empty Location Name'}</Typography>
              <Typography>{location.connectedLocationData?.type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {dateDuration[0] ? `From: ${dateDuration[0]?.toLocaleDateString()}` : '-'}
                {dateDuration[1] ? `Until: ${dateDuration[1]?.toLocaleDateString()}` : '-'}
              </Typography>
              <Typography>{`Time duration: ${location.duration?.value} ${location.duration?.timeUnit}`}</Typography>
              <Typography>Additional Info: {location.additionalInfo || 'None'}</Typography>
              <Typography>Cost: {location.cost ? `$${location.cost}` : 'Not provided'}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
