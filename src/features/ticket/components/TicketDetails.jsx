import React, { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
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
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../App";
import { useNotification } from "../../../global/context/NotificationContext";

const apiUrl = import.meta.env.VITE_API_URL;
const awsUrl = import.meta.env.VITE_AWS_API_URL;
const url = apiUrl || awsUrl;

export default function TicketDetails() {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const navigate = useNavigate();

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
      <Container sx={{ paddingTop: "8rem" }}>
        <Typography variant="h5" gutterBottom>
          Error fetching ticket details: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: "8rem", paddingBottom: "3%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card elevation={1}>
            <CardHeader
              title={
                <Typography variant="h4" gutterBottom>
                  {data && data.ticket && data.ticket.issue}
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data && data.ticket && data.ticket.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <b>Priority:</b>{" "}
                    {data && data.ticket && data.ticket.priority}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <b>Type:</b> {data && data.ticket && data.ticket.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <b>Status:</b> {data && data.ticket && data.ticket.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <b>Assigned User:</b>{" "}
                    {data && data.ticket && data.ticket.assignedUser}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Comments
              </Typography>
              {data && data.comments && data.comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              ) : (
                <List>
                  {data &&
                    data.comments &&
                    data.comments.map((comment) => (
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
                                {" — " +
                                  new Date(comment.createdAt).toLocaleString()}
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
          </Card>
        </Grid>
      </Grid>
      <CardActions sx={{ justifyContent: "flex-end", paddingBlock: "2rem" }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate(`/tickets`)}
        >
          Back
        </Button>
        <Link to={`/edit-ticket/${id}`}>
          <Button
            sx={{ marginInline: "1rem" }}
            variant="contained"
            color="primary"
          >
            Modify
          </Button>
        </Link>
      </CardActions>
    </Container>
  );
}
