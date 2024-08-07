import { Button, Card, CardContent, CardMedia, Chip, Divider, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ITrip } from '@/models/Trip';
import { TripMiniViewDialog } from '@/app/components/Dialogs/TripMiniViewDialog/TripMiniViewDialog';
import { getFormatDateDuration } from '@/app/utils/getFormatDateDuration';
import { currencyFormatter } from '@/app/utils/currencyFormatter';
import Grid from '@mui/material/Unstable_Grid2';

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

  const handleImgError = (e: any) => {
    e.target.src = '/EmptyTripImage.webp';
  };

  return (
    <>
      <Card>
        <CardMedia component="img" height="140" image={mainImageUrl} alt="Trip image" onError={handleImgError} />
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={8} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Tooltip title={name}>
                <Typography noWrap={true} gutterBottom variant="h6" component="p">
                  {name}
                </Typography>
              </Tooltip>
            </Grid>
            {totals?.totalAmountOfDays && <Grid xs={3}>{<Chip label={`${totals?.totalAmountOfDays} days`} />}</Grid>}
            <Grid xs={12}>
              <Divider light sx={{ mt: 1, mb: 1 }} />
            </Grid>
          </Grid>
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

      {isOpen && <TripMiniViewDialog tripId={trip._id || ''} isOpen={isOpen} handleClose={handleClose} />}
    </>
  );
};
