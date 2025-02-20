import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";
import { useNavigate } from "react-router";

export default function TicketForm() {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Med");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedUser, setAssignedUser] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = apiUrl || awsUrl;

  const priorities = ["Low", "Med", "High"];
  const types = ["Bug", "Feature", "Enhancement", "Refactor"];
  const statuses = ["Pending", "In Progress", "Complete"];

  const createTicket = async (newTicket) => {
    return axios
      .post(`${url}/post-ticket`, newTicket, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
  };

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setAlert({ message: "Ticket created successfully", severity: "success" });
      showNotification("Ticket created successfully", "success");
      // Reset form fields
      setIssue("");
      setDescription("");
      setPriority("Med");
      setType("");
      setStatus("Pending");
      setAssignedUser("");
      navigate("/tickets");
    },
    onError: (error) => {
      showNotification(`Error creating ticket: ${error.message}`, "error");
    },
  });

  const handleSaveTicket = () => {
    const newTicket = {
      issue,
      description,
      priority,
      type,
      status,
      assignedUser,
    };
    mutation.mutate(newTicket);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container
      sx={{ paddingTop: "8rem", display: "flex", justifyContent: "center" }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Create New Ticket
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Issue"
                fullWidth
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorities.map((prio) => (
                    <MenuItem key={prio} value={prio}>
                      {prio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  {types.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map((stat) => (
                    <MenuItem key={stat} value={stat}>
                      {stat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Assigned User"
                fullWidth
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                sx={{ marginInline: "0.5rem" }}
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTicket}
              >
                Save Ticket
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
