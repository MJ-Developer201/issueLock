import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            height: "40px",
            "& fieldset": {
              borderRadius: "10px",
            },
          },
        },
      },
    },
  },
});

export default theme;
