import React, { useContext, useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";

export default function Invites() {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const [invites, setInvites] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = awsUrl || apiUrl;

  const fetchInvites = async () => {
    try {
      const response = await axios.get(`${url}/get-invites`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setInvites(response.data.invites);
    } catch (error) {
      showNotification(`Error fetching invites: ${error.message}`, "error");
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [accessToken]);

  const acceptInvite = async (inviteId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/accept-invite`,
        { inviteId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      showNotification("Invite accepted successfully", "success");
      setInvites(invites.filter((invite) => invite.id !== inviteId));
    } catch (error) {
      showNotification(`Error accepting invite: ${error.message}`, "error");
    }
  };

  const handleOrganizationClick = (organizationId) => {
    // Handle the click event for the organization button
    console.log(`Organization ID: ${organizationId}`);
    // You can navigate to the organization page or perform any other action here
  };

  return (
    <div>
      <Typography variant="h5">Invites</Typography>
      <List>
        {invites.map((invite) => (
          <ListItem key={invite.id}>
            <ListItemText
              primary={
                <Button
                  style={{ marginBottom: "1rem" }}
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleOrganizationClick(invite.organization.id)
                  }
                >
                  {invite.organization?.name}
                </Button>
              }
              secondary={
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => acceptInvite(invite.id)}
                >
                  Accept
                </Button>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
