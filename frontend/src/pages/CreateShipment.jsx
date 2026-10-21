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
    errors.originAddress = "Origin address is required";
  }
  if (!form.destinationAddress.trim()) {
    errors.destinationAddress = "Destination address is required";
  }
  if (!form.receiverName.trim()) {
    errors.receiverName = "Receiver name is required";
  }
  if (!/^[0-9+\- ]{7,15}$/.test(form.receiverPhone.trim())) {
    errors.receiverPhone = "Invalid phone number";
  }
  if (form.receiverEmail && !/^\S+@\S+\.\S+$/.test(form.receiverEmail)) {
    errors.receiverEmail = "Invalid email";
  }
  if (!form.packageDescription.trim()) {
    errors.packageDescription = "Package description is required";
  }
  if (!isValidDimension(form.lengthCm)) {
    errors.lengthCm = "Between 0 and 200 cm";
  }
  if (!isValidDimension(form.widthCm)) {
    errors.widthCm = "Between 0 and 200 cm";
  }
  if (!isValidDimension(form.heightCm)) {
    errors.heightCm = "Between 0 and 200 cm";
  }
  if (form.weightKg !== "") {
    const weight = Number(form.weightKg);
    if (Number.isNaN(weight) || weight <= 0 || weight > 50) {
      errors.weightKg = "Between 0 and 50 kg";
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
      const response = await fetch(`${API_URL}/shipments`, {
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
      setError("Could not create the shipment. Please review the data and try again.");
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
          New shipment
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {field("originAddress", "Origin address")}
          {field("destinationAddress", "Destination address")}
          {field("receiverName", "Receiver name")}
          {field("receiverPhone", "Receiver phone")}
          {field("receiverEmail", "Receiver email (optional)", { type: "email" })}
          {field("packageDescription", "Package description", {
            multiline: true,
            minRows: 2,
          })}
          {field("lengthCm", "Length (cm)", { type: "number" })}
          {field("widthCm", "Width (cm)", { type: "number" })}
          {field("heightCm", "Height (cm)", { type: "number" })}
          {field("weightKg", "Weight (kg, optional)", { type: "number" })}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Sending..." : "Create shipment"}
          </Button>
        </Box>

        {trackingCode && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Shipment created. Tracking code: <strong>{trackingCode}</strong>
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
