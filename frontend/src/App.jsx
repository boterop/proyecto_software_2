import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/auth.css";

import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateShipment from "./pages/CreateShipment";
import Profile from "./pages/Profile";

const App = () => (
 <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/shipments/new" element={<CreateShipment />} />
      <Route path="/profile/:userId" element={<Profile />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
);

export default App;
