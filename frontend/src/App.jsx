import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import "./styles/auth.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateShipment from "./pages/CreateShipment";
import CreateIncidentReport from "./pages/CreateIncidentReport";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import ShipmentsHistory from "./pages/ShipmentsHistory";
import AppLayout from "./layouts/AppLayout";
import { useAuth } from "./hooks/useAuth";

const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const RequireUnAuth = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

const RequireAdmin = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<RequireUnAuth />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shipments/new" element={<CreateShipment />} />
          <Route path="/shipments" element={<ShipmentsHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/incident-reports/new"
            element={<CreateIncidentReport />}
          />
          <Route element={<RequireAdmin />}>
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
