'use client';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { ITrip } from '@/models/Trip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { getFormatDateDuration } from '@/app/utils/getFormatDateDuration';
import { currencyFormatter } from '@/app/utils/currencyFormatter';
import IconButton from '@mui/material/IconButton';
import { useGetFullTripById } from '@/app/hooks/useGetFullTripById';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

export interface TripMiniViewProps {
  trip: ITrip;
  handleClose: () => void;
  isOpen: boolean;
}

export const TripMiniView = ({ trip, handleClose, isOpen }: TripMiniViewProps) => {
  const { getFullTripById } = useGetFullTripById();
  const [fullTrip, setFullTrip] = useState<ITrip>();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchFullTripAndUpdateState = async () => {
      setIsLoading(true);
      const fullTripRes = await getFullTripById(trip._id);
      if (fullTripRes) {
        setFullTrip(fullTripRes);
        setIsLoading(false);
      }
    };

    void fetchFullTripAndUpdateState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateDuration =
    fullTrip?.locations && fullTrip.locations.length > 0
      ? getFormatDateDuration(fullTrip?.locations[0]?.dateRange)
      : [new Date(), new Date()];
  return (
    <Dialog
      scroll={'paper'}
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
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
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DialogContentText>
              Participants: {fullTrip?.participants_ids.length} - Visibility: {fullTrip?.visibility}
            </DialogContentText>
            {fullTrip?.locations.map((location, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                >
                  <Grid container xs={12} justifyContent="space-between" alignItems="center">
                    <Grid xs={8}>
                      <Typography variant="h6">
                        {location.connectedLocationData?.name || 'Empty Location Name'}
                      </Typography>
                    </Grid>
                    <Grid xs={4} style={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {location.connectedLocationData?.type}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component={'div'}>
                    <Typography color="text.secondary" component={'span'} variant={'subtitle2'}>
                      {dateDuration[0] && `From:`}
                    </Typography>
                    <Typography component={'span'} variant={'subtitle1'}>
                      {dateDuration[0] ? dateDuration[0]?.toLocaleDateString() : '-'}{' '}
                    </Typography>
                    <Typography color="text.secondary" component={'span'} variant={'subtitle2'}>
                      {dateDuration[1] && `Until:`}
                    </Typography>
                    <Typography component={'span'} variant={'subtitle1'}>
                      {dateDuration[1] ? dateDuration[1]?.toLocaleDateString() : '-'}
                    </Typography>
                  </Typography>
                  <Typography
                    variant={'subtitle1'}
                  >{`Time duration: ${location.duration?.value} ${location.duration?.timeUnit}`}</Typography>
                  <Typography>Additional Info: </Typography>
                  <Typography component={'div'}>{location.additionalInfo || 'None'}</Typography>
                  <Typography variant={'subtitle2'}>
                    Cost: {location.cost ? `${currencyFormatter.format(location.cost)}` : 'Not provided'}
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
