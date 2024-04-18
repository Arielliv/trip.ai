// useLocationData.js
import { useState } from 'react';
import { MapMarker } from '@/app/components/Map/Map';
import { usePlaceController } from '@/app/hooks/formControllers/usePlaceController';

export interface LocationContextObject {
  mapCenter: { lat: number; lng: number };
  zoom: number;
  place?: google.maps.places.PlaceResult | null;
  autocomplete: google.maps.places.Autocomplete | undefined;
  currentMarker: MapMarker | undefined;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
  onAutoCompletePlaceChange: (onChange: (...event: any[]) => void) => void;
  onAutoCompletePlaceEmpty: () => void;
}

export const useLocationData = (): LocationContextObject => {
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(8);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();
  const [currentMarker, setCurrentMarker] = useState<MapMarker>();
  const { onChange } = usePlaceController();

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
      const location = place.geometry ? place.geometry.location : null;

      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        const newMarker = {
          id: place.place_id || 'tempid',
          lat,
          lng,
        };

        setMapCenter({ lat, lng });
        onChange(place);
        setCurrentMarker(newMarker);
        setZoom(15);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return {
    mapCenter,
    zoom,
    autocomplete,
    currentMarker,
    onLoadAutocomplete,
    onAutoCompletePlaceChange,
    onAutoCompletePlaceEmpty,
  };
};
