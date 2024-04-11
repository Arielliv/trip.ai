// useLocationData.js
import { useState, useCallback } from 'react';
import { MapMarker } from '@/app/components/Map/Map';

export interface LocationData {
  markers: MapMarker[];
  mapCenter: { lat: number; lng: number };
  zoom: number;
  autocomplete: google.maps.places.Autocomplete | undefined;
  place: google.maps.places.PlaceResult | {};
  currentMarker: MapMarker | undefined;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChange: () => void;
}

export const useLocationData = (): LocationData => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(8);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();
  const [place, setPlace] = useState({});
  const [currentMarker, setCurrentMarker] = useState<MapMarker>();

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChange = useCallback(() => {
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
        setPlace(place);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        setCurrentMarker(newMarker);
        setZoom(15);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }, [autocomplete]);

  return { markers, mapCenter, zoom, autocomplete, place, currentMarker, onLoadAutocomplete, onPlaceChange };
};
