import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
const ProfileOptionsTab = ({ firstTab, secondTab }) => {
  return (
    <Tabs position="relative" variant='soft-rounded' colorScheme='blue' isLazy >
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Posts</Tab>
      </TabList>
      {/* <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" /> */}
      <TabPanels>
        <TabPanel>{firstTab}</TabPanel>
        <TabPanel>
          {secondTab}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileOptionsTab;
