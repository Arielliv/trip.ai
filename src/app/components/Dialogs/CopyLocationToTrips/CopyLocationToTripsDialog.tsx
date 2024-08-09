'use client';
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ILocationInTrip } from '@/models/Trip';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useAddLocationToTrips } from '@/app/hooks/query/useAddLocationToTrips';
import LoadingButton from '@mui/lab/LoadingButton';
import { useGetTripsForCopyLocationToTrips } from '@/app/hooks/useGetTripsForCopyLocationToTrips';
import { SelectableCheckboxes } from '@/app/components/Dialogs/SelectableCheckboxes/SelectableCheckboxes';

export interface SelectTripDialogProps {
  location?: ILocationInTrip;
  handleClose: () => void;
  isOpen: boolean;
}

export interface CopyLocationToTripsFormData {
  tripIds: string[];
}

export const CopyLocationToTripsDialog = ({ location, handleClose, isOpen }: SelectTripDialogProps) => {
  const theme = useTheme();
  const [isSubmitting] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { trips, tripsWithLocationIds, hasNextPage, fetchNextPage } = useGetTripsForCopyLocationToTrips(location);
  const { addLocationToTrips } = useAddLocationToTrips();
  const { reset, formState, handleSubmit, control } = useForm<CopyLocationToTripsFormData>();

  const onSubmit: SubmitHandler<CopyLocationToTripsFormData> = async (data): Promise<void> => {
    if (!location) {
      return;
    }

    if (Object.keys(formState.errors).length === 0) {
      addLocationToTrips({
        location,
        tripIds: data.tripIds.filter((tripId) => tripId != null),
      });
      reset();
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <form>
        <DevTool id={'select-trips'} placement={'bottom-right'} control={control} />
        <DialogTitle>Add Location to Selected Trips</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12}>
              <Typography variant="subtitle1">{`${location?.connectedLocationData?.name || ''} will be duplicated and assigned to selected trips:`}</Typography>
            </Grid>
          </Grid>
          <InfiniteScroll
            dataLength={trips.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            }
            height={'80vh'}
          >
            <SelectableCheckboxes
              defaultTripIds={tripsWithLocationIds}
              trips={trips}
              control={control}
              name="tripIds"
            />
          </InfiniteScroll>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton color="primary" loading={isSubmitting} onClick={handleSubmit(onSubmit)} autoFocus>
            Apply
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
