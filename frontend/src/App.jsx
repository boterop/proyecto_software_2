import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateShipment from "./pages/CreateShipment";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/shipments/new" element={<CreateShipment />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  </BrowserRouter>
);

export default App;
