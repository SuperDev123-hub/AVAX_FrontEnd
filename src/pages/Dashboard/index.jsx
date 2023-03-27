import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styled from "styled-components";
import MintPage from "./Mint";
import UsersPage from "./Users";

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("2");

  const handleChangeTab = (event, value) => {
    setSelectedTab(value);
  };

  return (
    <Container>
      <div className="header">
        <div>
          <p className="title"></p>
        </div>
        <div>
          <button className="button">Mint new item</button>
        </div>
      </div>
      <div className="body">
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChangeTab} aria-label="lab API tabs">
              {/* <Tab label="Dashboard" value="1" /> */}
              <Tab label="Minting" value="2" />
              {/* <Tab label="Listings" value="3" /> */}
              <Tab label="Users" value="4" />
            </TabList>
          </Box>
          {/* <TabPanel value="1">
            <DashboardPage />
          </TabPanel> */}
          <TabPanel value="2">
            <MintPage />
          </TabPanel>
          {/* <TabPanel value="3">
            <div className="sub-title">Listings</div>
            <ListingsPage />
          </TabPanel> */}
          <TabPanel value="4">
            <UsersPage />
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin: 30px;

  .header {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 28px;
      font-weight: 700;
      margin: 0px;
    }

    .button {
      width: 200px;
      height: 50px;
      border-radius: 5px;
      background-color: #e0335d;
      border: none;
      font-size: 18px;
      font-weight: 500;
      color: white;
    }
  }

  .body {
    .sub-title {
      font-size: 22px;
      font-weight: 500;
    }

    .Mui-selected {
      color: #e0335d;
    }

    .MuiTouchRipple-root-selected {
      border-bottom: 2px solid #e0335d;
    }

    .MuiPaginationItem-page.Mui-selected {
      background-color: #e0335d !important;
      color: #ffffff;
    }
  }
`;

export default Dashboard;
