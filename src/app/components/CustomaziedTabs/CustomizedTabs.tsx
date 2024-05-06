import { Box, Tab, Tabs } from '@mui/material';
import React, { ReactElement } from 'react';
import { TabPanel } from '@/app/components/TabPanel/TabPanel';
import { DataTestIds } from '@/app/components/constants/constants';

export const CustomizedTabs = ({
  tabs,
  dataTestPrefix = 'customizedTab',
}: {
  tabs: { title: string; element: (props: { setSelectedTab: (value: string) => void }) => ReactElement }[];
  dataTestPrefix?: string;
}) => {
  const [selectedTab, setSelectedTab] = React.useState('0');

  const handleSelectTab = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs variant="fullWidth" value={selectedTab} onChange={handleSelectTab} aria-label="Sidebar tabs">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.title}
            value={index.toString()}
            data-testid={DataTestIds.customizedTabAt(dataTestPrefix, index)}
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} index={index.toString()} selectedTabIndex={selectedTab}>
          {tab.element({ setSelectedTab })}
        </TabPanel>
      ))}
    </Box>
  );
};
