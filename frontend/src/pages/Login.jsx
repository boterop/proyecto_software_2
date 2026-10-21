import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  TextField,
} from "@mui/material";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        setFormError(err.detail);
      } else {
        setFormError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Accede con tu correo y contraseña para gestionar tus envíos."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link component={RouterLink} to="/register" className="auth-link">
            Regístrate
          </Link>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          margin="normal"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          margin="normal"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
        />

        <div className="auth-form__row">
          <Link
            component={RouterLink}
            to="/forgot-password"
            className="auth-link"
            underline="hover"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}

        <div className="auth-form__actions">
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </div>
      </Box>
    </AuthLayout>
  );
};

export default Login;
