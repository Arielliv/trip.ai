// useLocationData.js
import { useState } from 'react';
import { MapMarker } from '@/app/components/Map/Map';
import { usePlaceController } from '@/app/hooks/formControllers/usePlaceController';
import { LocationFormData } from '@/app/hooks/forms/useLocationForm';
import { Control } from 'react-hook-form';

export interface LocationContextObject {
  mapCenter: { lat: number; lng: number };
  zoom: number;
  place?: google.maps.places.PlaceResult | null;
  autocomplete: google.maps.places.Autocomplete | undefined;
  currentMarker: MapMarker | undefined;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
  onAutoCompletePlaceChange: () => void;
  onAutoCompletePlaceEmpty: () => void;
  handleFocusLocation: (coordinate: Omit<MapMarker, 'id'>) => void;
  handleFocusEditLocation: (mapMarker: MapMarker, zoomValue: number) => void;
  setMap: (map: google.maps.Map | null) => void;
  map: google.maps.Map | null;
}

export const useLocationData = (control?: Control<LocationFormData>): LocationContextObject => {
  const { onChange } = usePlaceController(control);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<Omit<MapMarker, 'id'>>({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(8);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();
  const [currentMarker, setCurrentMarker] = useState<MapMarker>();

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onAutoCompletePlaceEmpty = () => {
    setAutocomplete(undefined);
    onChange(undefined);
    setCurrentMarker(undefined);
  };

  const onAutoCompletePlaceChange = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place) {
        return;
      }
      const location = place.geometry ? place.geometry.location : null;

      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        const newMarker: MapMarker = {
          id: place.place_id || 'tempid',
          lat,
          lng,
        };
        handleFocusEditLocation(newMarker, 15);

        onChange(place);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const handleFocusEditLocation = (mapMarker: MapMarker, zoomValue: number) => {
    setMapCenter({ lat: mapMarker.lat, lng: mapMarker.lng });
    setCurrentMarker(mapMarker);
    setZoom(zoomValue);
  };

  const handleFocusLocation = (coordinate: Omit<MapMarker, 'id'>) => {
    setMapCenter(coordinate);
    setZoom(17);
  };

  return {
    map,
    setMap,
    mapCenter,
    zoom,
    autocomplete,
    currentMarker,
    onLoadAutocomplete,
    onAutoCompletePlaceChange,
    onAutoCompletePlaceEmpty,
    handleFocusLocation,
    handleFocusEditLocation,
  };
};
