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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/password-recovery/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setMessage(
        "If an account exists with that email, you will receive a password reset link.",
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Forgot password?
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your email and we'll send you a link to reset your password.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
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
              {loading ? "Sending..." : "Send reset link"}
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
