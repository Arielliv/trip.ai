import { Box, Tab, Tabs } from '@mui/material';
import LocationForm from '@/app/components/LocationForm/LocationForm';
import React from 'react';
import { TabPanel } from '@/app/components/TabPanel/TabPanel';
import SavedLocations from '@/app/components/SavedLocations/SavedLocations';

export const LocationTabs = () => {
  const [selectedTab, setSelectedTab] = React.useState('0');

  const handleSelectTab = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs variant="fullWidth" value={selectedTab} onChange={handleSelectTab} aria-label="Sidebar tabs">
        <Tab label="New location" value={'0'} />
        <Tab label="Saved locations" value={'1'} />
      </Tabs>
      <TabPanel index={'0'} selectedTabIndex={selectedTab}>
        <LocationForm />
      </TabPanel>
      <TabPanel index={'1'} selectedTabIndex={selectedTab}>
        <SavedLocations />
      </TabPanel>
    </Box>
  );
};
