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
  Typography,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MapMarker } from '@/app/components/Map/Map';

export interface LocationCardProps {
  location: ILocation;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (coordinate: Omit<MapMarker, 'id'>) => void;
}

export function LocationCard({ location, onEdit, onDelete, onSelect }: LocationCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

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
    onEdit(location._id!);
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
        maxHeight: 150,
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
          <Typography
            component="h3"
            sx={{
              fontSize: 17,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              marginBottom: 0,
              display: 'inline-block',
            }}
          >
            {location.name}
          </Typography>
          <Rating name="rating" value={0} size="small" readOnly sx={{ verticalAlign: 'text-top' }} />
        </Box>
        <Typography
          component="p"
          sx={{
            fontSize: 14,
            color: 'grey.500',
            mb: '1.275rem',
          }}
        >
          {location.note}
        </Typography>
        <Divider light sx={{ mt: 1, mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'flex-end', alignSelf: 'flex-end' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <IconButton sx={{ color: 'text.secondary' }} onClick={handleOnEditLocation}>
              <Edit />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', marginLeft: 1 }} onClick={handleDelete}>
              <Delete />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', marginLeft: 1 }} onClick={handleSelect}>
              <VisibilityIcon />
            </IconButton>
          </Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Action 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Action 2</MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
}
