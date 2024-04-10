'use client';

import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchLocation from '@/app/components/SearchLocation/SearchLocation';

export interface LocationFormProps {
  onPlaceChange: () => void;
  onLoadAutocomplete: (autocomplete: google.maps.places.Autocomplete) => void;
}

const LocationForm = ({ onPlaceChange, onLoadAutocomplete }: LocationFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Form submitted');
      // Here, implement what happens after form submission
    }, 2000);
  };

  return (
    <Accordion style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 1000 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Search and Add Location</AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SearchLocation onPlaceChange={onPlaceChange} onLoadAutocomplete={onLoadAutocomplete} />
          {/* Additional form inputs can be added here */}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default LocationForm;
