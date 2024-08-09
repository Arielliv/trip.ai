'use client';
import React, { useState } from 'react';
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
import ContentCopy from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getFormatDateDuration } from '@/app/utils/getFormatDateDuration';
import { currencyFormatter } from '@/app/utils/currencyFormatter';
import { useGetFullTripById } from '@/app/hooks/query/useFetchTripById';
import { useDuplicateTrip } from '@/app/hooks/useDuplicateTrip';
import { useTripsSearchContext } from '@/app/providers/TripsSearchContextProvider/TripsSearchContextProvider';
import LoadingButton from '@mui/lab/LoadingButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigateToLocationPageByTripId } from '@/app/hooks/useNavigateToLocationPageByTripId';
import ShareIcon from '@mui/icons-material/Share';
import { CopyLocationToTripsDialog } from '@/app/components/Dialogs/CopyLocationToTrips/CopyLocationToTripsDialog';
import { ILocationInTrip } from '@/models/Trip';

export interface TripMiniViewProps {
  tripId: string;
  handleClose: () => void;
  isOpen: boolean;
}

export const TripMiniViewDialog = ({ tripId, handleClose, isOpen }: TripMiniViewProps) => {
  const [isOpenSelectTripDialog, setIsOpenSelectTripDialog] = useState(false);
  const [locationToAdd, setLocationToAdd] = useState<ILocationInTrip>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Use react-query to fetch the full trip details
  const { data: fullTrip, isLoading } = useGetFullTripById(tripId);
  const { refetch } = useTripsSearchContext();
  const { duplicateTrip, isDuplicating } = useDuplicateTrip(refetch);
  const { navigateToLocationPageByTripId } = useNavigateToLocationPageByTripId();

  const handleDuplicate = () => {
    if (!tripId) {
      return;
    }

    duplicateTrip(tripId);
  };

  const handleView = () => {
    if (!tripId) {
      return;
    }

    navigateToLocationPageByTripId(tripId);
  };

  const handleSelectTripDialogOpen = (location: ILocationInTrip) => {
    setIsOpenSelectTripDialog(true);
    setLocationToAdd(location);
  };

  const handleSelectTripDialogClose = () => {
    setIsOpenSelectTripDialog(false);
  };

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
            <DialogContentText sx={{ my: 1 }}>
              <Grid container justifyContent="start" alignItems="center">
                <Grid xs={4}>
                  <Button endIcon={<LocationOnIcon />} autoFocus color={'secondary'} onClick={handleView}>
                    View locations
                  </Button>
                </Grid>
                <Grid xs={4}>
                  <LoadingButton
                    endIcon={<ContentCopyIcon />}
                    loading={isDuplicating}
                    disabled={isDuplicating}
                    autoFocus
                    color={'secondary'}
                    onClick={handleDuplicate}
                  >
                    Duplicate trip
                  </LoadingButton>
                </Grid>
                <Grid xs={4}>
                  <Button endIcon={<ShareIcon />} autoFocus color={'secondary'} disabled>
                    Share trip
                  </Button>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid xs={12}>
                  <Typography variant="subtitle1">Here you can find all the included locations:</Typography>
                </Grid>
              </Grid>
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
                    <IconButton
                      aria-label="Generate trip"
                      color="secondary"
                      size="large"
                      onClick={() => handleSelectTripDialogOpen(location)}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={12}>
                    <Typography color="text.secondary">
                      Dates: {dateDuration[0]?.toLocaleDateString()} - {dateDuration[1]?.toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Typography color="text.secondary">
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
      {isOpenSelectTripDialog && (
        <CopyLocationToTripsDialog
          location={locationToAdd}
          isOpen={isOpenSelectTripDialog}
          handleClose={handleSelectTripDialogClose}
        />
      )}
    </Dialog>
  );
};
