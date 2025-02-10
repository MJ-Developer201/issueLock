import React from "react";
import { Container, Card, CardContent, Typography } from "@mui/material";
import TeamTabs from "../features/team/components/TeamsTab";

export default function TeamPage() {
  return (
    <Container sx={{ paddingTop: "8rem", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Team Management
          </Typography>
          <TeamTabs />
        </CardContent>
      </Card>
    </Container>
  );
}
