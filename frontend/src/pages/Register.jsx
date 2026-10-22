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
import { useAuth } from "../context/useAuth";
import { ApiError } from "../services/api";
import {
  isPasswordValid,
  PASSWORD_MAX,
  PASSWORD_MESSAGE,
  PASSWORD_MIN,
} from "../utils/passwordRules";

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateClient = () => {
    const errors = {};
    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      errors.name = "El nombre debe tener entre 2 y 100 caracteres";
    } else if (!NAME_PATTERN.test(trimmedName)) {
      errors.name =
        "El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones";
    }

    if (!isPasswordValid(password)) {
      errors.password = PASSWORD_MESSAGE;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
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
      title="Crear cuenta"
      subtitle="Regístrate como cliente emisor para solicitar envíos de paquetes."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link component={RouterLink} to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Nombre completo"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
          margin="normal"
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
        />

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
          autoComplete="new-password"
          margin="normal"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
        />
        <p className="auth-field-hint">
          Entre {PASSWORD_MIN} y {PASSWORD_MAX} caracteres. {PASSWORD_MESSAGE}.
        </p>

        <TextField
          fullWidth
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          autoComplete="new-password"
          margin="normal"
          error={Boolean(fieldErrors.confirmPassword)}
          helperText={fieldErrors.confirmPassword}
        />

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
            {loading ? "Creando cuenta…" : "Registrarme"}
          </Button>
        </div>
      </Box>
    </AuthLayout>
  );
};

export default Register;
