'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useLocationContext } from '@/app/components/MyLocation/LocationDataContext';
import { ILocation } from '@/models/Location';
import { LocationType, Visibility } from '@/models/constants';
import { createLocation } from '@/lib/data';
import { Types } from 'mongoose';
import { useLocationForm } from '@/app/hooks/useLocationForm';

export interface LocationFormData {
  locationName: string;
  note: string;
  locationType: string;
  privacy: boolean;
  place: google.maps.places.PlaceResult;
}

const mapStringTypeToEnumType = (type: string) => {
  switch (type) {
    case 'general':
      return LocationType.General;
    case 'hotel':
      return LocationType.Hotel;
    case 'restaurant':
      return LocationType.Restaurant;
    default:
      return LocationType.General;
  }
};

const LocationForm = () => {
  const { onPlaceChange, onLoadAutocomplete } = useLocationContext();
  const formMethods = useLocationForm();

  const onSubmit = async (data: LocationFormData) => {
    if (Object.keys(formMethods.formState.errors).length === 0) {
      const newLocation: ILocation = {
        trips: [],
        name: data.locationName,
        note: data.note,
        type: mapStringTypeToEnumType(data.locationType),
        googlePlaceId: '',
        formattedAddress: '',
        placeTypes: [],
        coordinates: {
          latitude: 123.456,
          longitude: -78.901,
        },
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        },
        visibility: data.privacy ? Visibility.Public : Visibility.Public,
        user_id: new Types.ObjectId('615b1474edea400a9c3d83e4'),
        permissions: [],
        mapsUrl: '',
        businessStatus: '',
        /*        trips: [new Types.ObjectId()],
                                                                                                                                                        name: 'Eiffel Tower',
                                                                                                                                                        note: 'Iconic landmark in Paris',
                                                                                                                                                        type: LocationType.General,
                                                                                                                                                        googlePlaceId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
                                                                                                                                                        formattedAddress: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
                                                                                                                                                        placeTypes: ['tourist_attraction', 'point_of_interest', 'establishment'],
                                                                                                                                                        coordinates: {
                                                                                                                                                          latitude: 48.85837009999999,
                                                                                                                                                          longitude: 2.2944813,
                                                                                                                                                        },
                                                                                                                                                        address: {
                                                                                                                                                          street: 'Champ de Mars',
                                                                                                                                                          city: 'Paris',
                                                                                                                                                          state: 'Île-de-France',
                                                                                                                                                          country: 'France',
                                                                                                                                                          postalCode: '75007',
                                                                                                                                                        },
                                                                                                                                                        visibility: Visibility.Public,
                                                                                                                                                        user_id: new Types.ObjectId(),
                                                                                                                                                        permissions: [{ user_id: new Types.ObjectId(), role: Role.Owner }],
                                                                                                                                                        mapsUrl: 'https://goo.gl/maps/teJjfHjWnVBnpx2B8',
                                                                                                                                                        businessStatus: 'Operating',*/
      };
      try {
        await createLocation(newLocation);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const privacy = formMethods.watch('privacy');

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ p: 2 }}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Grid container spacing={2} flexDirection="column">
            <Grid xs={12}>
              <SearchLocation onPlaceChange={onPlaceChange} onLoadAutocomplete={onLoadAutocomplete} />
            </Grid>
            <Grid xs={12}>
              <TextField
                error={!!formMethods.formState.errors.locationName}
                label="Location Name"
                helperText={formMethods.formState.errors.locationName && 'Location name is required'}
                variant="outlined"
                fullWidth
                {...formMethods.register('locationName', { required: true })}
              />
            </Grid>
            <Grid xs={12} container spacing={2} alignItems="center">
              <Grid xs={8}>
                <FormControl fullWidth>
                  <InputLabel>Location Type</InputLabel>
                  <Select
                    {...formMethods.register('locationType')}
                    label="Location Type"
                    defaultValue="general"
                    fullWidth
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="hotel">Hotel</MenuItem>
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={4}>
                <FormControlLabel
                  control={<Switch {...formMethods.register('privacy')} />}
                  label={privacy ? 'Public' : 'Private'}
                />
              </Grid>
            </Grid>
            <Grid xs={12}>
              <TextField
                label="Note"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                {...formMethods.register('note')}
              />
            </Grid>
            <Grid xs={12}>
              <Button type="submit" variant="contained" fullWidth disabled={formMethods.formState.isSubmitting}>
                {formMethods.formState.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </FormProvider>
  );
};

export default LocationForm;
