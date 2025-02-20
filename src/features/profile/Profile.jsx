import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadSpinner from "../../global/components/LoadSpinner";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Typography,
  Modal,
  Avatar,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router";
import { PhotoCamera } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import { AuthContext } from "../../App";

export default function Profile() {
  const { accessToken } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openImgModal, setOpenImgModal] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = apiUrl || awsUrl;
  const navigate = useNavigate();

  const fetchUserData = async ({ queryKey }) => {
    console.log("Fetching user data...");
    const [, accessToken] = queryKey;
    return axios
      .get(`${url}/single-person`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data.user);
  };

  const {
    data: profile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", accessToken],
    queryFn: fetchUserData,
    enabled: !!accessToken,
  });

  const handleCancel = () => {
    navigate(-1);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseImgModal = () => setOpenImgModal(false);

  if (isLoading) {
    return <LoadSpinner />;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }
  return (
    <Container sx={{ paddingTop: "8rem", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: "0.3rem" }}
        >
          <Grid>
            <CardHeader
              avatar={
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <PhotoCamera
                      sx={{
                        maxWidth: "1.1rem",
                        maxHeight: "1.1rem",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpenImgModal(true)}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: "80px",
                      height: "80px",
                    }}
                    src={profile?.avatarUrl || ""}
                  >
                    {profile?.avatarUrl
                      ? null
                      : profile?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          ></Grid>
        </Grid>
        <Divider />
        <CardContent>
          <Grid container spacing={6}>
            <Grid display={"flex"} item xs={12} sm={6}>
              <PersonIcon color="primary" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Username: </b>
                {profile?.username}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <AccessTimeIcon color="secondary" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Age: </b>
                {profile?.age}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <FingerprintIcon color="action" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b> Bio:</b> {profile?.bio}
                <br />
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <MailOutlineIcon color="error" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Email:</b> {profile?.email}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <GroupsIcon color="disabled" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Position:</b> {profile?.position}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <PublicIcon color="primary" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Location:</b> {profile?.location}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <DomainOutlinedIcon color="secondary" />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Organization: </b> {profile?.organization?.name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", paddingBlock: "2rem" }}>
          <Button
            sx={{ marginInline: "1rem" }}
            color="inherit"
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Link to="/edit-profile">
            <Button
              sx={{ marginRight: "1.5rem" }}
              variant="contained"
              name="btnAddMore"
              onClick={handleOpen}
            >
              Edit Profile
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Container>
  );
}
