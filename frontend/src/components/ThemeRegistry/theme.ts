import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Graphik-Regular", "Helvetica", "Arial"].join(","),
    button: {
      textTransform: "none",
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "rgba(66, 61, 137, 1)",
      contrastText: "#fff",
    },
    secondary: {
      main: "rgba(66, 61, 137, 1)",
    },
  },
});

export default theme;
