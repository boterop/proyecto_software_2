import { Box, Button, CircularProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api.js";
import { TestLocation } from "@components";

const roleLabel = (role) => {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "REPARTIDOR":
      return "Repartidor";
    case "CLIENTE_EMISOR":
      return "Cliente emisor";
    case "CLIENTE_RECEPTOR":
      return "Cliente receptor";
    default:
      return role;
  }
};

const Home = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="home-shell">
        <CircularProgress aria-label="Cargando sesión" />
      </div>
    );
  }

  const logout = async () => {
    const response = await api("/auth/logout");

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    window.location.reload();
  };

  return (
    <div className="home-shell">
      <div className="home-panel">
        <h1 className="home-panel__title">UQ Delivery</h1>

        <span className="home-user-badge">
          {user.name} · {roleLabel(user.role)}
        </span>
        <div className="home-panel__actions">
          <Button component={RouterLink} to="/profile" variant="contained">
            Mi perfil
          </Button>
          <Button variant="outlined" color="inherit" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={RouterLink}
            to="/shipments/new"
            variant="contained"
          >
            Registrar envío
          </Button>
          <Button
            component={RouterLink}
            to="/shipments"
            variant="contained"
          >
            Historial de envíos
          </Button>
          <Button
            component={RouterLink}
            to="/incident-reports/new"
            variant="contained"
          >
            Reportar incidente
          </Button>
          {isAdmin && (
            <Button
              component={RouterLink}
              to="/admin/users"
              variant="contained"
              color="secondary"
            >
              Administrar usuarios
            </Button>
          )}
          {isAdmin && (
            <Button
              component={RouterLink}
              to="/admin/shipments"
              variant="contained"
              color="secondary"
            >
              Asignar repartidores
            </Button>
          )}
        </Box>
      </div>
      <TestLocation />
    </div>
  );
};

export default Home;
