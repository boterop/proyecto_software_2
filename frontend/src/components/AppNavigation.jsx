import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { getNavItems } from "./navigationItems";
import { roleLabel } from "../utils/roleLabel";

const getInitials = (name) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

const itemSx = (theme) => ({
  position: "relative",
  borderRadius: 2,
  mb: 0.5,
  px: 1.5,
  py: 1,
  color: "text.secondary",
  "& .MuiListItemIcon-root": { minWidth: 40, color: "inherit" },
  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.06) },
  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
  "&.Mui-selected": {
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.dark",
    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.14) },
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 8,
      bottom: 8,
      width: 4,
      borderRadius: 2,
      bgcolor: "primary.main",
    },
  },
});

/**
 * Contenido de la navegación privada. Se reutiliza tal cual dentro del
 * Drawer permanente (escritorio) y del Drawer temporal (móvil).
 */
const AppNavigation = ({ user, isAdmin, onNavigate, onLogout, loggingOut }) => {
  const { pathname } = useLocation();
  const items = getNavItems(isAdmin);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        component={RouterLink}
        to="/"
        onClick={onNavigate}
        aria-label="UQ Delivery, ir al inicio"
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          height: 64,
          flexShrink: 0,
          color: "text.primary",
          textDecoration: "none",
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        })}
      >
        <Box
          aria-hidden
          sx={(theme) => ({
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: theme.palette.brand.accent,
            color: "primary.dark",
          })}
        >
          <LocalShippingOutlinedIcon fontSize="small" />
        </Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
          UQ Delivery
        </Typography>
      </Box>

      <Divider />

      <Box
        component="nav"
        aria-label="Navegación principal"
        sx={{ flexGrow: 1, overflowY: "auto", p: 1.5 }}
      >
        <List disablePadding>
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.isActive(pathname);

            return (
              <ListItemButton
                key={item.id}
                component={RouterLink}
                to={item.to}
                selected={active}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                sx={itemSx}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { fontWeight: active ? 700 : 500, fontSize: 15 },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2, flexShrink: 0 }}>
        {user && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
          >
            <Avatar
              aria-hidden
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {roleLabel(user.role)}
              </Typography>
            </Box>
          </Box>
        )}
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          onClick={onLogout}
          disabled={loggingOut}
          sx={{ borderColor: "divider", justifyContent: "flex-start" }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default AppNavigation;
