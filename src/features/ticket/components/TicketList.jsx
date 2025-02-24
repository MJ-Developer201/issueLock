import React, { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Container,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";

const apiUrl = import.meta.env.VITE_API_URL;
const awsUrl = import.meta.env.VITE_AWS_API_URL;
const url = apiUrl || awsUrl;

export default function TicketList() {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const [noTicketsMessage, setNoTicketsMessage] = useState("");

  const fetchTickets = async () => {
    const response = await axios.get(`${url}/get-tickets`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["tickets", accessToken],
    queryFn: fetchTickets,
    enabled: !!accessToken,
    onSuccess: (data) => {
      if (data.message === "No tickets found") {
        setNoTicketsMessage(data.message);
        showNotification("No tickets found for the current project", "info");
      }
    },
    onError: (error) => {
      showNotification(`Error fetching tickets: ${error.message}`, "error");
    },
  });

  if (isLoading) {
    return (
      <Container sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Loading tickets...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Error fetching tickets: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: "8rem" }}>
      <Typography variant="h5" gutterBottom>
        Tickets
      </Typography>
      {noTicketsMessage ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="body1">{noTicketsMessage}</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned User</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.issue}</TableCell>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.assignedUser}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/ticket-details/${ticket.id}`}
                        onClick={() => console.log(`Ticket ID: ${ticket.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
