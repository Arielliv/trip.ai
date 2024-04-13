'use client';
import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  List,
  ListItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFetchLocations } from '@/app/hooks/useFetchLocations';

const SavedLocations = () => {
  const { locations, loadLocations, loading, hasMore, error } = useFetchLocations();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <InfiniteScroll
      dataLength={locations.length}
      next={loadLocations}
      hasMore={hasMore}
      loader={
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      }
      endMessage={<p style={{ textAlign: 'center' }}>No more locations</p>}
    >
      <List>
        {locations.map((location, index) => (
          <ListItem key={index} data-testid="saved-location">
            <Card sx={{ display: 'flex', width: '100%' }}>
              <CardMedia component="img" sx={{ width: 151 }} image={location.imageUrl} alt="Location image" />
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h5" component="div">
                  {location.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small">Delete</Button>
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose}>Action 1</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Action 2</MenuItem>
                </Menu>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default SavedLocations;
