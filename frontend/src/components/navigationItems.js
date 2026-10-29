import { matchPath } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const matches = (pattern, pathname) =>
  matchPath({ path: pattern, end: true }, pathname) !== null;

// Fuente única de verdad de la navegación privada. Solo apunta a rutas que
// ya existen en App.jsx.
export const NAV_ITEMS = [
  {
    id: "home",
    label: "Inicio",
    to: "/",
    icon: HomeOutlinedIcon,
    isActive: (pathname) => matches("/", pathname),
  },
  {
    id: "profile",
    label: "Mi perfil",
    to: "/profile",
    icon: AccountCircleOutlinedIcon,
    isActive: (pathname) => matches("/profile", pathname),
  },
  {
    id: "shipments-new",
    label: "Registrar envío",
    to: "/shipments/new",
    icon: Inventory2OutlinedIcon,
    isActive: (pathname) => matches("/shipments/new", pathname),
  },
  {
    id: "shipments",
    label: "Historial de envíos",
    to: "/shipments",
    icon: ReceiptLongOutlinedIcon,
    isActive: (pathname) => matches("/shipments", pathname),
  },
  {
    id: "incident-reports-new",
    label: "Reportar incidente",
    to: "/incident-reports/new",
    icon: ReportProblemOutlinedIcon,
    isActive: (pathname) => matches("/incident-reports/new", pathname),
  },
  {
    id: "admin-users",
    label: "Administrar usuarios",
    to: "/admin/users",
    icon: AdminPanelSettingsOutlinedIcon,
    adminOnly: true,
    // El perfil de otro usuario (/profile/:userId) solo se alcanza desde aquí.
    isActive: (pathname) =>
      matches("/admin/users", pathname) ||
      matches("/profile/:userId", pathname),
  },
];

export const getNavItems = (isAdmin) =>
  NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

export const getPageTitle = (pathname) => {
  if (matches("/profile/:userId", pathname)) {
    return "Perfil de usuario";
  }
  return NAV_ITEMS.find((item) => item.isActive(pathname))?.label ?? "";
};

// A dónde volver cuando no hay historial interno (p. ej. al abrir la URL
// directamente en una pestaña nueva).
export const getBackFallback = (pathname) =>
  matches("/profile/:userId", pathname) ? "/admin/users" : "/";
