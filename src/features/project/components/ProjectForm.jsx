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
import { useNavigate } from "react-router";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";

export default function ProjectForm() {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [cloud, setCloud] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [client, setClient] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.VITE_AWS_API_URL;
  const url = apiUrl || awsUrl;

  const languages = ["JavaScript", "Python", "Java", "C#", "Ruby", "PHP"];
  const frameworks = [
    "React",
    "Angular",
    "Vue",
    "Express",
    "Django",
    "Ruby on Rails",
  ];
  const clouds = ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Heroku"];

  const createProject = async (newProject) => {
    return axios
      .post(`${url}/post-project`, newProject, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
  };

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      showNotification("Project created successfully", "success");
      // Reset form fields
      setProjectName("");
      setProjectDescription("");
      setLanguage("");
      setFramework("");
      setCloud("");
      setProjectManager("");
      setClient("");
    },
    onError: (error) => {
      showNotification(`Error creating project: ${error.message}`, "error");
    },
  });

  const handleSaveProject = () => {
    const newProject = {
      projectName,
      projectDescription,
      language,
      framework,
      cloud,
      projectManager,
      client,
    };
    mutation.mutate(newProject);
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
            Create New Project
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Project Name"
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Project Description"
                fullWidth
                multiline
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Framework</InputLabel>
                <Select
                  value={framework}
                  label="Framework"
                  onChange={(e) => setFramework(e.target.value)}
                >
                  {frameworks.map((fw) => (
                    <MenuItem key={fw} value={fw}>
                      {fw}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cloud</InputLabel>
                <Select
                  value={cloud}
                  label="Cloud"
                  onChange={(e) => setCloud(e.target.value)}
                >
                  {clouds.map((cloud) => (
                    <MenuItem key={cloud} value={cloud}>
                      {cloud}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Project Manager"
                fullWidth
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client"
                fullWidth
                value={client}
                onChange={(e) => setClient(e.target.value)}
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
                onClick={handleSaveProject}
              >
                Save Project
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
