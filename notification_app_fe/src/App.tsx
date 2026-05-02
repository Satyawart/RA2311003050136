import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import NotificationsPage from "./pages/NotificationsPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3f51b5" },
    secondary: { main: "#7c4dff" },
    background: { default: "#f5f7fa" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsPage />
    </ThemeProvider>
  );
}
