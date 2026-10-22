import { Link as RouterLink } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../context/useAuth";

const roleLabel = (role) => {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "REPARTIDOR":
      return "Repartidor";
    case "CLIENTE_EMISOR":
      return "Cliente emisor";
    default:
      return role;
  }
};

const Home = () => {
  const { user, isAuthenticated, bootstrapping, logout } = useAuth();

  if (bootstrapping) {
    return (
      <div className="home-shell">
        <CircularProgress aria-label="Cargando sesión" />
      </div>
    );
  }

  return (
    <div className="home-shell">
      <div className="home-panel">
        <h1 className="home-panel__title">UQ Delivery</h1>

        {isAuthenticated ? (
          <>
            <span className="home-user-badge">
              {user.name} · {roleLabel(user.role)}
            </span>
            <p className="home-panel__text">
              Sesión iniciada como <strong>{user.email}</strong>. Desde aquí
              podrás acceder al resto de funciones del sistema conforme se vayan
              implementando.
            </p>
            <div className="home-panel__actions">
              <Button variant="outlined" color="inherit" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="home-panel__text">
              Plataforma de gestión de envíos y entregas. Inicia sesión o crea
              una cuenta para registrar paquetes y consultar tu historial.
            </p>
            <div className="home-panel__actions">
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
              >
                Iniciar sesión
              </Button>
              <Button component={RouterLink} to="/register" variant="outlined">
                Registrarse
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
