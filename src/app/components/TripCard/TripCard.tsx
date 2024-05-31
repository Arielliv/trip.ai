import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ITrip } from '@/models/Trip';
import { TripMiniView } from '@/app/components/TripMiniView/TripMiniView';
import { getFormatDateDuration } from '@/app/utils/getFormatDateDuration';
import { currencyFormatter } from '@/app/utils/currencyFormatter';

export interface TripCardProps {
  trip: ITrip;
  index: number;
}

export const TripCard = ({ trip: { mainImageUrl, name, totals, locations }, trip }: TripCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalDateRange = getFormatDateDuration(totals?.totalDateRange);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card>
        <CardMedia component="img" height="140" image={mainImageUrl} alt="Trip image" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totals && totals.totalDateRange && totals.totalDateRange[0]
              ? `From: ${totalDateRange[0]?.toLocaleDateString()} `
              : '-'}
            {totals && totals.totalDateRange && totals.totalDateRange[1]
              ? `Until: ${totalDateRange[1]?.toLocaleDateString()}`
              : '-'}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            Total trip cost: {totals && totals.totalCost && currencyFormatter.format(totals.totalCost)}
          </Typography>
          <Typography variant="body2">Locations: {locations.length}</Typography>
          <Button fullWidth variant="contained" sx={{ marginTop: 2 }} onClick={handleOpen}>
            Check it out
          </Button>
        </CardContent>
      </Card>

      {isOpen && <TripMiniView trip={trip} isOpen={isOpen} handleClose={handleClose} />}
    </>
  );
};
