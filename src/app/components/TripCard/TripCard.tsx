import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { ITrip } from '@/models/Trip';

export interface TripCardProps {
  trip: ITrip;
  index: number;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
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
        <Button fullWidth variant="contained" sx={{ marginTop: 2 }}>
          Check it out
        </Button>
      </CardContent>
    </Card>
  );
};
