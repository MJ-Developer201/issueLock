import React, { useState, useContext, useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";
import { useParams, useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL;
const awsUrl = import.meta.env.VITE_AWS_API_URL;
const url = apiUrl || awsUrl;

export default function TicketEdit() {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Med");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedUser, setAssignedUser] = useState("");

  const priorities = ["Low", "Med", "High"];
  const types = ["Bug", "Feature", "Enhancement", "Refactor"];
  const statuses = ["Pending", "In Progress", "Complete"];

  const fetchTicketDetails = async () => {
    const response = await axios.get(`${url}/get-ticket/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ticket", accessToken],
    queryFn: fetchTicketDetails,
    enabled: !!accessToken,
    onError: (error) => {
      showNotification(
        `Error fetching ticket details: ${error.message}`,
        "error"
      );
    },
  });

  useEffect(() => {
    if (data && data.ticket) {
      console.log("Fetched ticket data:", data);
      setIssue(data.ticket.issue || "");
      setDescription(data.ticket.description || "");
      setPriority(data.ticket.priority || "Med");
      setType(data.ticket.type || "");
      setStatus(data.ticket.status || "Pending");
      setAssignedUser(
        data.ticket.assignedUser === "null"
          ? ""
          : data.ticket.assignedUser || ""
      );
    }
  }, [data]);

  const updateTicket = async (updatedTicket) => {
    return axios
      .put(`${url}/update-ticket/${id}`, updatedTicket, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
  };

  const mutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", accessToken] });
      showNotification("Ticket updated successfully", "success");
      navigate(`/ticket-details/${id}`);
    },
    onError: (error) => {
      showNotification(`Error updating ticket: ${error.message}`, "error");
    },
  });

  const handleSaveTicket = () => {
    const updatedTicket = {
      issue,
      description,
      priority,
      type,
      status,
      assignedUser,
    };
    mutation.mutate(updatedTicket);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Container sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Loading ticket details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Error fetching ticket details: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{ paddingTop: "8rem", display: "flex", justifyContent: "center" }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Edit Ticket
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
