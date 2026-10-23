import { Button, CircularProgress } from "@mui/material";
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
  };

  return (
      <div className="home-shell">
        <div className="home-panel">
          <h1 className="home-panel__title">UQ Delivery</h1>

          <span className="home-user-badge">
          {user.name} · {roleLabel(user.role)}
        </span>
          <p className="home-panel__text">
            Sesión iniciada como <strong>{user.email}</strong>. Desde aquí podrás
            acceder al resto de funciones del sistema conforme se vayan
            implementando.
          </p>
          <div className="home-panel__actions">
            <Button component={RouterLink} to="/profile" variant="contained">
              Mi perfil
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
            <Button variant="outlined" color="inherit" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
        <TestLocation />
      </div>
  );
};

export default Home;
