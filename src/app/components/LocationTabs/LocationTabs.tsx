import { Tab, Tabs } from '@mui/material';
import LocationForm from '@/app/components/LocationForm/LocationForm';
import React from 'react';
import { TabPanel } from '@/app/components/TabPanel/TabPanel';

export const LocationTabs = () => {
  const [selectedTab, setSelectedTab] = React.useState('0');
  const handleSelectTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      <Tabs variant="fullWidth" value={selectedTab} onChange={handleSelectTab} aria-label="Sidebar tabs">
        <Tab label="New location" value={'0'} />
        <Tab label="My locations" />
      </Tabs>
      <TabPanel index={'0'} selectedTabIndex={selectedTab}>
        <LocationForm />
      </TabPanel>
      <TabPanel index={'1'} selectedTabIndex={selectedTab}></TabPanel>
    </>
  );
};
