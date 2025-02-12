import React, { useContext } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";

export default function InviteForm({ email, setEmail, handleCancel }) {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = apiUrl || awsUrl;

  const inviteUser = async ({ email, organizationId }) => {
    return axios
      .post(
        `${url}/create-invite`,
        { email, organizationId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => response.data);
  };

  const mutation = useMutation({
    mutationFn: (data) => inviteUser(data),
    onSuccess: () => {
      showNotification("Invite sent successfully", "success");
      setEmail("");
    },
    onError: (error) => {
      showNotification(`Error sending invite: ${error.message}`, "error");
    },
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const organizationId = "your-organization-id"; // Replace with the actual organization ID
    mutation.mutate({ email, organizationId });
  };

  return (
    <form onSubmit={handleInviteSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginRight: 1 }}
          >
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
