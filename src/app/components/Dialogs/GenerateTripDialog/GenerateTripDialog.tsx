import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useGenerateTripForm } from '@/app/hooks/useGenerateTripForm';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { DevTool } from '@hookform/devtools';
import { useOnGenerateTripFormSubmit } from '@/app/hooks/formSubmission/useOnGenerateTripFormSubmit';

export interface GenerateTripDialogProps {
  handleClose: () => void;
  isOpen: boolean;
}

const GenerateTripDialog = ({ isOpen, handleClose }: GenerateTripDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useGenerateTripForm();
  const { onSubmit } = useOnGenerateTripFormSubmit(handleClose);

  const handleFormSubmit = () => {
    setIsSubmitting(true);
    handleSubmit(onSubmit)();
    setIsSubmitting(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Generate trip</DialogTitle>

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
      <DialogContent>
        <DevTool id={'generate-trip'} placement={'bottom-left'} control={control} />
        <Grid xs={12}>
          <Typography variant="subtitle1">
            Fill out the requested info, and a custom made trip will be generated for you
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} flexDirection="column">
            <Grid xs={12}>
              <TextField
                error={!!errors.whereTo}
                label="Where to go?"
                helperText={errors.whereTo?.message && errors.whereTo.message}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                {...register('whereTo', {
                  required: 'Where to go is required in order to generate a better trip plan',
                })}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                error={!!errors.howMany}
                helperText={errors.howMany?.message && errors.howMany.message}
                type="number"
                label="How many travelers?"
                variant="outlined"
                fullWidth
                {...register('howMany', {
                  required: 'How many travelers are required in order to generate a better trip plan',
                })}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                error={!!errors.howLong}
                helperText={errors.howLong?.message && errors.howLong.message}
                label="How many days?"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                {...register('howLong', {
                  required: 'How many days is required in order to generate a better trip plan',
                })}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                error={!!errors.whatStyle}
                helperText={errors.whatStyle?.message && errors.whatStyle.message}
                label="What style of trip do you prefer?"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                {...register('whatStyle', {
                  required: 'What style of trip is required in order to generate a better trip plan',
                })}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton disabled={isSubmitting} loading={isSubmitting} onClick={handleFormSubmit} autoFocus>
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateTripDialog;
