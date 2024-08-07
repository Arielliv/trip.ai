import { ILocation } from '@/models/Location';
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MapMarker } from '@/app/components/Map/Map';
import { LongTextNote } from '@/app/components/LongTextNote/LongTextNote';
import { LocationPermissionFilter } from '@/app/components/LocationPermissionFilter/LocationPermissionFilter';
import { LocationPermissionEnum } from '@/models/constants/constants';
import FilesDialog from '@/app/components/Dialogs/FilesDialog/FilesDialog';

export interface LocationCardProps {
  location: ILocation;
  onEdit: (id: string, coordinate: Omit<MapMarker, 'id'>) => void;
  onDelete: (id: string) => void;
  onSelect: (coordinate: Omit<MapMarker, 'id'>) => void;
}

export function LocationCard({ location, onEdit, onDelete, onSelect }: LocationCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false);

  const handleFilesDialogOpen = () => {
    setIsFilesDialogOpen(true);
  };

  const handleFilesDialogClose = () => {
    setIsFilesDialogOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(location._id!);
  };

  const handleSelect = () => {
    onSelect({ lat: location.coordinates.latitude, lng: location.coordinates.longitude });
  };

  const handleOnEditLocation = () => {
    onEdit(location._id!, { lat: location.coordinates.latitude, lng: location.coordinates.longitude });
  };

  return (
    <Card
      // elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        // padding: 1,
        borderRadius: '10px',
        width: '100%',
        maxHeight: 160,
        '&:hover': {
          backgroundColor: 'action.hover',
          transition: 'background-color 0.3s ease',
        },
      }}
    >
      <CardMedia
        component="img"
        image={location.imageUrl}
        sx={{
          minWidth: '20%',
          maxWidth: '40%',
          maxHeight: '20%',
          flexShrink: 0,
          backgroundColor: 'grey.200',
          borderRadius: '10px 0px 0px 10px',
          boxShadow: '0 2px 8px 0 rgba(193, 209, 217, 0.5), 0 -2px 8px 0 rgba(204, 225, 233, 0.5)',
        }}
      />
      <CardContent sx={{ flexGrow: 1, pr: 2 }}>
        <Box mb={1}>
          <Tooltip title={location.name}>
            <Typography
              component="h3"
              sx={{
                fontSize: 17,
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                marginBottom: 0,
                textOverflow: 'ellipsis',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                display: '-webkit-box',
              }}
            >
              {location.name}
            </Typography>
          </Tooltip>
          <Rating name="rating" value={0} size="small" readOnly sx={{ verticalAlign: 'text-top' }} />
        </Box>
        <Box mb={1}>
          <LongTextNote value={location.note ?? ''} />
        </Box>
        <Divider light />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'flex-end', alignSelf: 'flex-end' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <LocationPermissionFilter permissions={location.permissions} permissionLevel={LocationPermissionEnum.edit}>
              <IconButton sx={{ color: 'text.secondary' }} onClick={handleOnEditLocation}>
                <Edit />
              </IconButton>
            </LocationPermissionFilter>
            <LocationPermissionFilter permissions={location.permissions} permissionLevel={LocationPermissionEnum.admin}>
              <IconButton sx={{ color: 'text.secondary', marginLeft: 1 }} onClick={handleDelete}>
                <Delete />
              </IconButton>
            </LocationPermissionFilter>
            <IconButton sx={{ color: 'text.secondary', marginLeft: 1 }} onClick={handleSelect}>
              <VisibilityIcon />
            </IconButton>
          </Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleFilesDialogOpen}>Show files</MenuItem>
          </Menu>
        </Box>
      </CardContent>
      {isFilesDialogOpen && (
        <FilesDialog files={location.files} isOpen={isFilesDialogOpen} handleClose={handleFilesDialogClose} />
      )}
    </Card>
  );
}
