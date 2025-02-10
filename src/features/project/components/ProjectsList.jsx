import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Tooltip,
  Typography,
  Container,
} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useNotification } from "../../../global/context/NotificationContext";
import { AuthContext } from "../../../App";

export default function ProjectsList() {
  const { accessToken } = useContext(AuthContext);
  const showNotification = useNotification();
  const [projects, setProjects] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const awsUrl = import.meta.env.AWS_API_URL;
  const url = awsUrl || apiUrl;

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${url}/get-projects`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProjects(response.data.projects);
    } catch (error) {
      showNotification(`Error fetching projects: ${error.message}`, "error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [accessToken]);

  return (
    <Container sx={{ paddingTop: "8rem" }}>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            key={project.id}
            className="projects-list-grid"
          >
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3}>
                <CardHeader
                  action={
                    <Tooltip title="Delete">
                      <IconButton>
                        <DeleteOutlineOutlined />
                      </IconButton>
                    </Tooltip>
                  }
                  titleTypographyProps={{
                    fontSize: "1.3rem",
                    color: "#333333",
                    fontFamily: "inherit",
                  }}
                  title={
                    <Link
                      style={{ textDecoration: "none", color: "#333333" }}
                      to={`/project/${project.id}`}
                    >
                      <motion.div whileHover={{ color: "#2b6f83" }}>
                        {project.projectName}
                      </motion.div>
                    </Link>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color={"textSecondary"}>
                    {project.projectDescription}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
