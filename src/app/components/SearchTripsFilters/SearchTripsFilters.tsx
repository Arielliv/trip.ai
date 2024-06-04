import React, { useMemo } from 'react';
import { Box, Divider, Button, Slider, Typography } from '@mui/material';
import { useTripsSearchContext } from '@/app/providers/TripsSearchContextProvider/TripsSearchContextProvider';
import { currencyFormatter } from '@/app/utils/currencyFormatter';

export const SearchTripsFilters = () => {
  const {
    timeFilter,
    locationFilter,
    priceRangeFilter,
    toggleTimeFilter,
    setLocationFilter,
    setPriceRangeFilter,
    clearFilters,
  } = useTripsSearchContext();

  const countries = useMemo(
    () => [
      'Asia',
      'Europe',
      'Australia',
      'North America',
      'South America',
      'Africa',
      'Germany',
      'Japan',
      'England',
      'France',
    ],
    [],
  );

  const times = useMemo(
    () => ['One day', 'Three days', 'Five days', 'One week', 'Two weeks', 'One month', 'Two months', 'Half a year'],
    [],
  );

  const handleTimeFilter = (value: string) => {
    toggleTimeFilter(value);
  };

  const handleLocationFilter = (value: string) => {
    if (locationFilter === value) {
      setLocationFilter(''); // Deselect if already selected
    } else {
      setLocationFilter(value);
    }
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRangeFilter({ minPrice: (newValue as number[])[0], maxPrice: (newValue as number[])[1] });
  };

  const valueLabelFormat = (value: number) => {
    return currencyFormatter.format(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h6">Filter by Time</Typography>
      <Divider sx={{ my: 1 }} />
      <Box>
        {times.map((option) => (
          <Button
            key={option}
            variant={timeFilter.includes(option) ? 'contained' : 'outlined'}
            onClick={() => handleTimeFilter(option)}
            sx={{ m: 1 }}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Typography variant="h6">Filter by Location</Typography>
      <Divider sx={{ my: 1 }} />
      <Box>
        {countries.map((option) => (
          <Button
            key={option}
            variant={locationFilter === option ? 'contained' : 'outlined'}
            onClick={() => handleLocationFilter(option)}
            sx={{ m: 1 }}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Typography variant="h6">Filter by Price</Typography>
      <Divider sx={{ my: 1 }} />
      <Slider
        value={priceRangeFilter ? [priceRangeFilter.minPrice, priceRangeFilter.maxPrice] : [0, 10000]}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        valueLabelFormat={valueLabelFormat}
        min={0}
        max={10000}
      />
      <Button sx={{ my: 5 }} variant="outlined" color="secondary" onClick={clearFilters}>
        Clear Filters
      </Button>
    </Box>
  );
};
