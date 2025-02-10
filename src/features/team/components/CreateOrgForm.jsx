import React from "react";
import { TextField, Button, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";
import { useContext } from "react";

export default function CreateOrgForm({ orgName, setOrgName, handleCancel }) {
  //
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.AWS_API_URL;
  const url = awsUrl || apiUrl;

  //
  const createOrganization = async ({ accessToken, orgName }) => {
    return axios
      .post(
        `${url}/create-org`,
        { name: orgName },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => response.data);
  };

  console.log(accessToken);
  const mutation = useMutation({
    mutationFn: (data) => createOrganization(data),
    onSuccess: () => {
      showNotification("Organization created successfully", "success");
      setOrgName("");
    },
    onError: (error) => {
      showNotification(
        `Error creating organization: ${error.message}`,
        "error"
      );
    },
  });

  const handleCreateOrgSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ accessToken, orgName });
  };

  console.log(accessToken);

  return (
    <form onSubmit={handleCreateOrgSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
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
