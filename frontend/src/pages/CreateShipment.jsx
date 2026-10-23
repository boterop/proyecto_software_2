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
import { api } from "@services/api.js";

// TODO(HU-01): replace with the authenticated user's id when login is integrated.
const TEMP_SENDER_ID = 1;

const EMPTY = {
  originAddress: "",
  destinationAddress: "",
  receiverName: "",
  receiverPhone: "",
  receiverEmail: "",
  packageDescription: "",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  weightKg: "",
};

const isValidDimension = (value) => {
  const number = Number(value);
  return value !== "" && !Number.isNaN(number) && number > 0 && number <= 200;
};

const validate = (form) => {
  const errors = {};

  if (!form.originAddress.trim()) {
    errors.originAddress = "La dirección de origen es requerida";
  }
  if (!form.destinationAddress.trim()) {
    errors.destinationAddress = "La dirección de destino es requerida";
  }
  if (!form.receiverName.trim()) {
    errors.receiverName = "El nombre del receptor es requerido";
  }
  if (!/^[0-9+\- ]{7,15}$/.test(form.receiverPhone.trim())) {
    errors.receiverPhone = "Número de teléfono inválido";
  }
  if (form.receiverEmail && !/^\S+@\S+\.\S+$/.test(form.receiverEmail)) {
    errors.receiverEmail = "Correo inválido";
  }
  if (!form.packageDescription.trim()) {
    errors.packageDescription = "La descripción del paquete es requerida";
  }
  if (!isValidDimension(form.lengthCm)) {
    errors.lengthCm = "Entre 0 y 200 cm";
  }
  if (!isValidDimension(form.widthCm)) {
    errors.widthCm = "Entre 0 y 200 cm";
  }
  if (!isValidDimension(form.heightCm)) {
    errors.heightCm = "Entre 0 y 200 cm";
  }
  if (form.weightKg !== "") {
    const weight = Number(form.weightKg);
    if (Number.isNaN(weight) || weight <= 0 || weight > 50) {
      errors.weightKg = "Entre 0 y 50 kg";
    }
  }

  return errors;
};

const CreateShipment = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingCode, setTrackingCode] = useState("");

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setTrackingCode("");

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await api(`/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          senderId: TEMP_SENDER_ID,
          receiverEmail: form.receiverEmail || null,
          lengthCm: Number(form.lengthCm),
          widthCm: Number(form.widthCm),
          heightCm: Number(form.heightCm),
          weightKg: form.weightKg === "" ? null : Number(form.weightKg),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setTrackingCode(data.trackingCode);
      setForm(EMPTY);
      setErrors({});
    } catch {
      setError(
        "No se pudo crear el envío. Por favor revise los datos e inténtelo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, props = {}) => (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      value={form[name]}
      onChange={handleChange(name)}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      {...props}
    />
  );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nuevo envío
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {field("originAddress", "Dirección de origen")}
          {field("destinationAddress", "Dirección de destino")}
          {field("receiverName", "Nombre del receptor")}
          {field("receiverPhone", "Teléfono del receptor")}
          {field("receiverEmail", "Correo del receptor (opcional)", {
            type: "email",
          })}
          {field("packageDescription", "Descripción del paquete", {
            multiline: true,
            minRows: 2,
          })}
          {field("lengthCm", "Longitud (cm)", { type: "number" })}
          {field("widthCm", "Ancho (cm)", { type: "number" })}
          {field("heightCm", "Altura (cm)", { type: "number" })}
          {field("weightKg", "Peso (kg, opcional)", { type: "number" })}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Enviando..." : "Crear envío"}
          </Button>
        </Box>

        {trackingCode && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Envío creado. Código de seguimiento: <strong>{trackingCode}</strong>
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default CreateShipment;
