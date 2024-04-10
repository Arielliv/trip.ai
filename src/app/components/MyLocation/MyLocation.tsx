'use client';

import Map, { MapMarker } from '@/app/components/Map/Map';
import LocationForm from '@/app/components/LocationForm/LocationForm';
import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

const MyLocation = () => {
  const placesLibrary = ['places' as any];
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(8);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();
  const [place, setPlace] = useState({});
  const [currentMarker, setCurrentMarker] = useState<MapMarker>();

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handlePlaceChange = () => {
    if (autocomplete !== null) {
      const place = autocomplete!.getPlace();
      const location = place.geometry ? place.geometry.location : null;

      if (location) {
        const lat = location!.lat();
        const lng = location!.lng();
        const newMarker = {
          id: place.place_id || 'asd',
          lat: lat,
          lng: lng,
        };

        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setPlace(place);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        setCurrentMarker(newMarker);
        setZoom(15);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <>
      <LoadScript
        libraries={placesLibrary}
        onError={(error) => console.error('There was an error loading the Google Maps API:', error)}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'fallback_api_key_here'}
      >
        <Map markers={markers} focusMarker={currentMarker} center={mapCenter} zoom={zoom} />
        <LocationForm onPlaceChange={handlePlaceChange} onLoadAutocomplete={onLoadAutocomplete} />
      </LoadScript>
    </>
  );
};

export default MyLocation;
