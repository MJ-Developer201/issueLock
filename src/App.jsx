import "./App.css";
import Sidebar from "./global/components/Sidebar";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { createContext, useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./global/utils/theme";
import { fetchAuthSession } from "aws-amplify/auth";
import { NotificationProvider } from "./global/context/NotificationContext";
import TeamPage from "./pages/TeamPage";
import axios from "axios";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ProjectPage from "./pages/ProjectPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import TicketsPage from "./pages/TicketsPage";
import TicketFormPage from "./pages/TicketFormPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import EditTicketPage from "./pages/EditTicketPage";
Amplify.configure(awsExports);

//
export const AuthContext = createContext(null);

const queryClient = new QueryClient();

function App({ signOut, user }) {
  const [accessToken, setAccessToken] = useState("");
  const emailId = user.signInDetails.loginId;

  useEffect(() => {
    if (user) {
      fetchAuthSession()
        .then((session) => {
          const { accessToken } = session.tokens ?? {};
          setAccessToken(accessToken);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  console.log(accessToken);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ accessToken }}>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
              <Sidebar signOut={signOut} />
              <Container maxWidth="xl">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/tickets" element={<TicketsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/projects" element={<ProjectPage />} />
                  <Route
                    path="/ticket-details/:id"
                    element={<TicketDetailsPage />}
                  />

                  <Route path="/ticket-form" element={<TicketFormPage />} />
                  <Route path="/edit-ticket/:id" element={<EditTicketPage />} />

                  <Route path="/project-form" element={<ProjectFormPage />} />
                  <Route path="/edit-profile" element={<EditProfilePage />} />
                </Routes>
              </Container>
            </Box>
          </ThemeProvider>
        </NotificationProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default withAuthenticator(App);
