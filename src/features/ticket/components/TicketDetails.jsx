import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../../App";
import { useNotification } from "../../../global/context/NotificationContext";

const apiUrl = import.meta.env.VITE_API_URL;
const awsUrl = import.meta.env.VITE_AWS_API_URL;
const url = apiUrl || awsUrl;

export default function TicketDetails() {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(`${url}/get-ticket/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTicket(response.data.ticket);
      setComments(response.data.comments);
    } catch (error) {
      showNotification(
        `Error fetching ticket details: ${error.message}`,
        "error"
      );
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id, accessToken]);

  if (!ticket) {
    return (
      <Container sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Loading ticket details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: "8rem", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              {ticket.issue}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {ticket.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <b>Priority:</b> {ticket.priority}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <b>Type:</b> {ticket.type}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <b>Status:</b> {ticket.status}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <b>Assigned User:</b> {ticket.assignedUser}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          ) : (
            <List>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment.userInitials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.userName}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.text}
                          </Typography>
                          {" — " + new Date(comment.createdAt).toLocaleString()}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", paddingBlock: "2rem" }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button
            sx={{ marginInline: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Modify
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
