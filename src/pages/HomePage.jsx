import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Align items to the top
          height: "100vh",
          backgroundImage: `url('/blake-connally-B3-2.jpg')`, // Update the path to your image
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "10vh", // Add padding to move the content down a bit
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h2" color="white" gutterBottom>
            Welcome to IssueLock
          </Typography>
          <Link to="/profile">
            <Button variant="contained" color="primary">
              Go to Profile
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
