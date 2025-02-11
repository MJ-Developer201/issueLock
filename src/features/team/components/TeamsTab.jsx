import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import InviteForm from "./InviteForm";
import CreateOrgForm from "./CreateOrgForm";
import ListUsers from "./ListUsers";
import { useNotification } from "../../../global/context/NotificationContext";
import axios from "axios";
import Invites from "./Invites";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamTabs() {
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const showNotification = useNotification();
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = awsUrl || apiUrl;

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/send-invite`, { email });
      showNotification("Invite sent successfully", "success");
      setEmail("");
    } catch (error) {
      showNotification(`Error sending invite: ${error.message}`, "error");
    }
  };

  const handleCancel = () => {
    setEmail("");
    setOrgName("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="team management tabs"
      >
        <Tab label="Invite" />
        <Tab label="Create Organization" />
        <Tab label="List Users" />
        <Tab label="Invites" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <InviteForm
          email={email}
          setEmail={setEmail}
          handleInviteSubmit={handleInviteSubmit}
          handleCancel={handleCancel}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <CreateOrgForm
          orgName={orgName}
          setOrgName={setOrgName}
          handleCancel={handleCancel}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ListUsers />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <Invites />
      </TabPanel>
    </Box>
  );
}
