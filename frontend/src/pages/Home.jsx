import {
  Box,
  Chip,
  CircularProgress,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "@hooks/useAuth";
import { TestLocation } from "@components";
import { roleLabel } from "../utils/roleLabel";

const MAIN_ACTIONS = [
  {
    to: "/shipments/new",
    title: "Registrar envío",
    description: "Crea un envío nuevo y obtén su código de seguimiento.",
    icon: Inventory2OutlinedIcon,
  },
  {
    to: "/shipments",
    title: "Historial de envíos",
    description: "Consulta tus envíos y su estado actual.",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    to: "/incident-reports/new",
    title: "Reportar incidente",
    description: "Informa un problema con ubicación y fotografía.",
    icon: ReportProblemOutlinedIcon,
  },
];

// Tarjeta completamente clicable: el enlace del título se estira sobre toda
// la tarjeta, así el nombre accesible del enlace es solo el título.
const ActionCard = ({ to, title, description, icon: Icon, compact = false }) => (
  <Paper
    variant="outlined"
    sx={(theme) => ({
      position: "relative",
      display: "flex",
      flexDirection: compact ? "row" : "column",
      alignItems: compact ? "center" : "flex-start",
      gap: 2,
      p: { xs: 2.5, md: 3 },
      borderRadius: 3,
      transition: "border-color 0.15s, background-color 0.15s",
      "&:hover": {
        borderColor: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.03),
      },
    })}
  >
    <Box
      aria-hidden
      sx={(theme) => ({
        display: "grid",
        placeItems: "center",
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: "primary.main",
      })}
    >
      <Icon />
    </Box>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Typography variant="h6" component="h3" sx={{ fontSize: 17 }}>
        <Link
          component={RouterLink}
          to={to}
          underline="none"
          color="inherit"
          sx={(theme) => ({
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
            },
            "&:focus-visible": { outline: "none" },
            "&:focus-visible::after": {
              outline: `3px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          })}
        >
          {title}
        </Link>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
    <ArrowForwardIcon aria-hidden fontSize="small" sx={{ color: "primary.main" }} />
  </Paper>
);

const Home = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress aria-label="Cargando sesión" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1040, mx: "auto", px: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "& .route-end": { fill: theme.palette.brand.accent },
        })}
      >
        <Box sx={{ position: "relative", maxWidth: { md: 520 } }}>
          <Chip
            label={roleLabel(user.role)}
            size="small"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "primary.contrastText",
              bgcolor: "rgba(255, 255, 255, 0.16)",
            }}
          />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Hola, {user.name}
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9 }}>
            Gestiona tus envíos y reporta novedades desde un solo lugar.
          </Typography>
        </Box>

        <Box
          component="svg"
          aria-hidden
          focusable="false"
          viewBox="0 0 320 120"
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            right: 32,
            bottom: 24,
            width: 300,
          }}
        >
          <path
            d="M8 96 C 70 96, 90 24, 150 40 S 250 100, 308 28"
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2.5"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="96"
            r="7"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle className="route-end" cx="308" cy="28" r="9" />
        </Box>
      </Paper>

      <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
        ¿Qué quieres hacer?
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {MAIN_ACTIONS.map((action) => (
          <ActionCard key={action.to} {...action} />
        ))}
      </Box>

      <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
        Tu cuenta
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        <ActionCard
          compact
          to="/profile"
          title="Mi perfil"
          description="Revisa y actualiza tus datos personales."
          icon={AccountCircleOutlinedIcon}
        />
        {isAdmin && (
          <ActionCard
            compact
            to="/admin/users"
            title="Administrar usuarios"
            description="Gestiona las cuentas y los roles."
            icon={AdminPanelSettingsOutlinedIcon}
          />
        )}
      </Box>

      <TestLocation />
    </Box>
  );
};

export default Home;
