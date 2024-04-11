import React from 'react';

export const TabPanel = ({
  children,
  index,
  selectedTabIndex,
  ...rest
}: React.PropsWithChildren & { selectedTabIndex: string; index: string }) => {
  return (
    <div
      role="tabpanel"
      hidden={selectedTabIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {selectedTabIndex === index && children}
    </div>
  );
};
