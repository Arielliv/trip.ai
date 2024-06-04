'use client';
import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getFormatDateDuration } from '@/app/utils/getFormatDateDuration';
import { currencyFormatter } from '@/app/utils/currencyFormatter';
import { useGetFullTripById } from '@/app/hooks/query/useFetchTripById';
import { ITrip } from '@/models/Trip';

export interface TripMiniViewProps {
  trip: ITrip;
  handleClose: () => void;
  isOpen: boolean;
}

export const TripMiniView = ({ trip, handleClose, isOpen }: TripMiniViewProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Use react-query to fetch the full trip details
  const { data: fullTrip, isLoading } = useGetFullTripById(trip._id);

  const dateDuration =
    fullTrip?.locations && fullTrip.locations.length > 0
      ? getFormatDateDuration(fullTrip.locations[0].dateRange)
      : [new Date(), new Date()];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{fullTrip?.name}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DialogContentText>
              <Typography variant="subtitle1">Here you can find all the included locations:</Typography>
            </DialogContentText>
            {fullTrip?.locations.map((location, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                >
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {location.connectedLocationData?.name || 'Empty Location Name'}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {location.connectedLocationData?.type}
                    </Typography>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">From: {dateDuration[0]?.toLocaleDateString()}</Typography>
                  <Typography color="text.secondary">Until: {dateDuration[1]?.toLocaleDateString()}</Typography>
                  <Typography variant="subtitle1">
                    Time duration: {location.duration?.value} {location.duration?.timeUnit}
                  </Typography>
                  <Typography>Additional Info: {location.additionalInfo || 'None'}</Typography>
                  <Typography variant="subtitle2">
                    Cost: {location.cost ? currencyFormatter.format(location.cost) : 'Not provided'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
