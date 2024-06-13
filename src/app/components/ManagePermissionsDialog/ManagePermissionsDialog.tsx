import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  CircularProgress,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { usePermissionsController } from '@/app/hooks/formControllers/usePermissionsController';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import { Types } from 'mongoose';
import { useInfiniteUsers } from '@/app/hooks/query/useInfiniteUsers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Unstable_Grid2';
import { PermissionInput } from '@/app/components/PermissionInput/PermissionInput';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface ManagePermissionsDialogProps {
  handleClose: () => void;
  isOpen: boolean;
}

const ManagePermissionsDialog = ({ isOpen, handleClose }: ManagePermissionsDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteUsers(10);
  const users = data?.pages.flatMap((page) => page.users) || [];

  const { fields, append, update, remove } = usePermissionsController();

  const handleAddNewPermission = () => {
    append({ userId: new Types.ObjectId(), permissionType: TripPermissionEnum.ViewBasic });
  };

  const handleRemovePermission = (index: number) => {
    remove(index);
  };

  const handleUserChange = (index: number, event: SelectChangeEvent<string>) => {
    update(index, { ...fields[index], userId: event.target.value as unknown as any });
  };

  const handlePermissionChange = (
    index: number,
    event: SelectChangeEvent<TripPermissionEnum | LocationPermissionEnum>,
  ) => {
    update(index, { ...fields[index], permissionType: event.target.value as unknown as any });
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
      <DialogTitle id="responsive-dialog-title">Manage Permissions</DialogTitle>
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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid xs={12}>
              {fields.length === 0 ? (
                <Typography variant={'body1'} sx={{ color: 'text.secondary', mt: 1, my: 1 }}>
                  Here you can control who has access to what, and how much access he has
                </Typography>
              ) : (
                fields.map((field, index) => (
                  <PermissionInput
                    field={field}
                    index={index}
                    users={users}
                    key={field.id}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isLoading={isLoading}
                    handleRemovePermission={handleRemovePermission}
                    handleUserChange={handleUserChange}
                    handlePermissionChange={handlePermissionChange}
                  />
                ))
              )}
            </Grid>

            <Grid xs={12}>
              <Button fullWidth variant="outlined" onClick={handleAddNewPermission}>
                Add New User
              </Button>
            </Grid>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManagePermissionsDialog;
