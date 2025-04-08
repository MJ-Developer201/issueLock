import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
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
  TextField,
} from "@mui/material";
import { PhotoCamera, Token } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import { AuthContext } from "../App";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadSpinner from "../global/components/LoadSpinner";
import { useNotification } from "../global/context/NotificationContext";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = apiUrl || awsUrl;

  const fetchUserData = async ({ queryKey }) => {
    const [, accessToken] = queryKey;
    return axios
      .get(`${url}/single-person`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data.user);
  };

  const updateUser = async ({ updateFields, accessToken }) => {
    return axios
      .post(`${url}/update-user`, updateFields, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
  };

  const {
    data: profile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", accessToken],
    queryFn: fetchUserData,
    enabled: !!accessToken,
    onSuccess: () => {
      showNotification("Profile Update Successfully", "success");
    },
    onError: (error) => {
      showNotification("Error updating user data:" + error.message);
    },
  });

  const showNotification = useNotification();
  const [username, setUsername] = useState(profile?.username || "");
  const [age, setAge] = useState(profile?.age || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [position, setPosition] = useState(profile?.position || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [organization, setOrganization] = useState(profile?.organization || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseImgModal = () => setOpenImgModal(false);

  const mutation = useMutation({
    mutationFn: (updateFields) => updateUser({ updateFields, accessToken }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setAlert({ message: "Data saved successfully", severity: "success" });
      navigate("/profile");
      showNotification("Profile Update Successfully", "success");
      handleClose();
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      showNotification("Error updating user data:" + error.message);

      setAlert({ message: "Error saving data", severity: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateFields = {
      username,
      age,
      bio,
      email,
      position,
      location,
      organization,
    };
    mutation.mutate(updateFields);
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ paddingTop: "8rem", paddingBottom: "3%" }}>
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
                    src={avatarUrl}
                  >
                    {username.charAt(0).toUpperCase()}
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
          >
            <CardActions>
              <Button
                variant="contained"
                name="btnAddMore"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </CardActions>
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <Grid container spacing={6}>
            <Grid display={"flex"} item xs={12} sm={6}>
              <PersonIcon color="primary" />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <AccessTimeIcon color="secondary" />
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <FingerprintIcon color="action" />
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <MailOutlineIcon color="error" />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <GroupsIcon color="disabled" />
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <PublicIcon color="primary" />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid>
            {/* <Grid display={"flex"} item xs={12} sm={6}>
              <DomainOutlinedIcon color="secondary" />
              <TextField
                fullWidth
                label="Organization"
                name="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                sx={{ paddingLeft: "1rem" }}
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <div>
          {/* Placeholder for EditProfileModal */}
          <Typography>Edit Profile Modal</Typography>
        </div>
      </Modal>
      <Modal open={openImgModal} onClose={handleCloseImgModal}>
        <div>
          {/* Placeholder for ProfilePictureModal */}
          <Typography>Profile Picture Modal</Typography>
        </div>
      </Modal>
    </Container>
  );
}
