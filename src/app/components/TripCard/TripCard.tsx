import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ITrip } from '@/models/Trip';
import { TripMiniView } from '@/app/components/TripMiniView/TripMiniView';

export interface TripCardProps {
  trip: ITrip;
  index: number;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card>
        <CardMedia component="img" height="140" image={'/path-to-trip-image.jpg'} alt="Trip image" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {trip.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration:
          </Typography>
          <Typography variant="body2">Locations: {trip.locations.length}</Typography>
          <Button fullWidth variant="contained" sx={{ marginTop: 2 }} onClick={handleOpen}>
            Check it out
          </Button>
        </CardContent>
      </Card>

      <TripMiniView trip={trip} isOpen={isOpen} handleClose={handleClose} />
    </>
  );
};
