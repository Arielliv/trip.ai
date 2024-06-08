import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LocationPermissionEnum, TripPermissionEnum } from '@/models/enums/permissionsEnums';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { usePermissionsController } from '@/app/hooks/formControllers/usePermissionsController';
import { IUserPermission } from '@/models/shared/types';
import { IUser } from '@/models/IUser';

export interface PermissionInputProps {
  field: IUserPermission;
  index: number;
  users: IUser[];
  fetchNextPage: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
  handleRemovePermission: (index: number) => void;
  handleUserChange: (index: number, event: SelectChangeEvent<string>) => void;
  handlePermissionChange: (
    index: number,
    event: SelectChangeEvent<TripPermissionEnum | LocationPermissionEnum>,
  ) => void;
}

export const PermissionInput = ({
  field,
  index,
  users,
  fetchNextPage,
  isLoading,
  hasNextPage,
  handleRemovePermission,
  handleUserChange,
  handlePermissionChange,
}: PermissionInputProps) => {
  const { fields } = usePermissionsController();

  const isUserSelected = (userId: string) => {
    return fields.some((field) => field.userId.toString() === userId);
  };

  return (
    <Grid container spacing={1} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
      <Grid xs={6}>
        <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="SelectUser">Select User</InputLabel>
          <InfiniteScroll
            scrollableTarget="usersScrollableContiner"
            dataLength={users.length}
            next={() => fetchNextPage!()}
            hasMore={!isLoading && hasNextPage}
            loader={
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            }
          >
            <Select
              labelId="SelectUser"
              value={field.userId.toString()}
              placeholder="Select User"
              label="selectUser"
              fullWidth
              onChange={(event) => handleUserChange(index, event)}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id} disabled={isUserSelected(user._id)}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </InfiniteScroll>
        </FormControl>
      </Grid>
      <Grid xs={5}>
        <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="SelectPermission">Select Permission</InputLabel>
          <Select
            placeholder="Select Permission"
            label="SelectPermission"
            labelId="SelectPermission"
            value={field.permissionType}
            defaultValue={TripPermissionEnum.ViewBasic}
            fullWidth
            onChange={(event) => handlePermissionChange(index, event)}
          >
            {Object.entries(TripPermissionEnum)
              .filter(([_key, value]) => !isNaN(Number(value)))
              .map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {key}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={1}>
        <IconButton onClick={() => handleRemovePermission(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
