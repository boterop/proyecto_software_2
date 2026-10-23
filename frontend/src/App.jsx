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
import Profile from "./pages/Profile";
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
        <Route path="/" element={<Home />} />
        <Route path="/shipments/new" element={<CreateShipment />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
