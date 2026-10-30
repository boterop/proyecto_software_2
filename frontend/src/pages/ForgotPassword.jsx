import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    fetch(`${API_URL}/password-recovery/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).finally(() => setLoading(false));

    setMessage(
      "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.",
    );
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ¿Olvidaste tu contraseña?
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu
            contraseña.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
            </Button>
          </Box>

          {message && (
            <Alert severity="info" sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
