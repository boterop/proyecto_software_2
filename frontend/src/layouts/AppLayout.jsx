import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppNavigation from "../components/AppNavigation";
import { getBackFallback, getPageTitle } from "../components/navigationItems";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api.js";

const DRAWER_WIDTH = 272;

/**
 * Layout de las rutas privadas: navegación lateral fija en escritorio,
 * Drawer con botón de menú en pantallas pequeñas y barra superior con
 * el botón "Volver". Las páginas se renderizan en <Outlet />.
 */
const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const { user, isAdmin } = useAuth();
  const { pathname, key } = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const mainRef = useRef(null);
  const lastPathname = useRef(pathname);

  // Al cambiar de página, el foco pasa al contenido (útil con teclado y
  // lectores de pantalla en una SPA).
  useEffect(() => {
    if (lastPathname.current === pathname) {
      return;
    }
    lastPathname.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const isHome = pathname === "/";
  const title = getPageTitle(pathname);

  const handleBack = () => {
    // key === "default" indica que esta es la primera entrada del historial
    // (URL abierta directamente): no hay a dónde volver con navigate(-1).
    if (key !== "default") {
      navigate(-1);
      return;
    }
    navigate(getBackFallback(pathname));
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const response = await api("/auth/logout");

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      window.location.reload();
    } catch {
      setLoggingOut(false);
      setLogoutError(true);
    }
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const navigation = (
    <AppNavigation
      user={user}
      isAdmin={isAdmin}
      onNavigate={closeMobileMenu}
      onLogout={handleLogout}
      loggingOut={loggingOut}
    />
  );

  const skipToContent = (event) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Box
        component="a"
        href="#main-content"
        onClick={skipToContent}
        sx={{
          position: "absolute",
          left: 16,
          top: -64,
          zIndex: theme.zIndex.tooltip + 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: "primary.dark",
          color: "primary.contrastText",
          fontWeight: 600,
          textDecoration: "none",
          "&:focus": { top: 16 },
        }}
      >
        Saltar al contenido
      </Box>

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {navigation}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobileMenu}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              maxWidth: "85vw",
              boxSizing: "border-box",
            },
          }}
        >
          {navigation}
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: 64 }}>
            {!isDesktop && (
              <IconButton
                edge="start"
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {!isHome && (
              <Button
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
              >
                Volver
              </Button>
            )}

            <Typography
              component="p"
              noWrap
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                display: { xs: isHome ? "block" : "none", sm: "block" },
                ml: isHome ? 0 : 1,
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          sx={{ flexGrow: 1, py: { xs: 2, md: 3 }, outline: "none" }}
        >
          <Outlet />
        </Box>
      </Box>

      <Snackbar
        open={logoutError}
        autoHideDuration={6000}
        onClose={(_event, reason) => {
          if (reason !== "clickaway") {
            setLogoutError(false);
          }
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setLogoutError(false)}
        >
          No se pudo cerrar la sesión. Inténtalo de nuevo.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppLayout;
