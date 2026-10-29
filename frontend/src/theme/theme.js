import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B5D6B",
      dark: "#073F49",
      light: "#3E8C99",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#B45309",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F2F5F6",
      paper: "#ffffff",
    },
    text: {
      primary: "#14262C",
      secondary: "#4A5C63",
    },
    divider: "#DCE4E7",
    // Acento de marca de UQ Delivery (logo y detalles puntuales).
    brand: {
      accent: "#F5A524",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export default theme;
