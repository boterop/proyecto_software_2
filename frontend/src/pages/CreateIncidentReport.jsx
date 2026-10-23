import { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  createFilterOptions,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationPicker from "../components/LocationPicker";
import { api } from "@services/api.js";

const CreateIncidentReport = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState(null);

  const [form, setForm] = useState({
    deliveryId: "",
    userId: "",
    incidentType: "",
    description: "",
    location: "",
    status: "OPEN",
    evidence: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deliveriesResponse, usersResponse] = await Promise.all([
          api(`/shipments`),
          api(`/users`),
        ]);

        if (!deliveriesResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to load data");
        }

        const deliveries = await deliveriesResponse.json();
        setDeliveries(
          deliveries.filter(
            (d) => d.status != "CANCELLED" && d.status != "DELIVERED",
          ),
        );
        const users = await usersResponse.json();
        setUsers(users.filter((u) => u.role === "REPARTIDOR"));
      } catch {
        setMessage("Failed to load deliveries or users.");
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const body = {
        ...form,
        location: `${location.latitude},${location.longitude}`,
        deliveryId: Number(form.deliveryId),
        userId: Number(form.userId),
        timestamp: Date.now(),
      };
      const response = await api(`/incident-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident report");
      }

      setMessage("Incident reported successfully.");

      setLocation(null);

      setForm({
        deliveryId: "",
        userId: "",
        incidentType: "",
        description: "",
        location: "",
        status: "OPEN",
        evidence: "",
      });
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEvidenceChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setMessage("Please select an evidence image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const size = Math.min(img.width, img.height);

        const canvas = document.createElement("canvas");

        const maxSize = 800;
        const outputSize = Math.min(size, maxSize);

        canvas.width = outputSize;
        canvas.height = outputSize;

        const ctx = canvas.getContext("2d");

        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        ctx.drawImage(img, x, y, size, size, 0, 0, outputSize, outputSize);

        const base64 = canvas.toDataURL("image/jpeg", 0.5);

        setForm((current) => ({
          ...current,
          evidence: base64,
        }));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const filter = createFilterOptions({
    stringify: (delivery) =>
      `${delivery.trackingCode} ${delivery.packageDescription}`,
  });

  const userFilter = createFilterOptions({
    stringify: (user) => `${user.name} ${user.email}`,
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Report an incident
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Provide the details of the incident.
          </Typography>

          {message && (
            <Alert
              severity={
                message === "Incident reported successfully."
                  ? "success"
                  : "error"
              }
              sx={{ mt: 3 }}
            >
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Autocomplete
              fullWidth
              options={deliveries}
              filterOptions={filter}
              value={
                deliveries.find(
                  (delivery) => delivery.id === form.deliveryId,
                ) || null
              }
              onChange={(_, delivery) => {
                handleChange({
                  target: {
                    name: "deliveryId",
                    value: delivery?.id || "",
                  },
                });
              }}
              getOptionLabel={(delivery) =>
                `${delivery.trackingCode} (${delivery.packageDescription.substring(0, 25)}${delivery.packageDescription.length > 25 ? "..." : ""})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Delivery"
                  margin="normal"
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={users}
              filterOptions={userFilter}
              value={users.find((user) => user.id === form.userId) || null}
              onChange={(_, user) => {
                handleChange({
                  target: {
                    name: "userId",
                    value: user?.id || "",
                  },
                });
              }}
              getOptionLabel={(user) => `${user.name} - ${user.email}`}
              renderInput={(params) => (
                <TextField {...params} required label="User" margin="normal" />
              )}
            />

            <TextField
              fullWidth
              required
              select
              label="Incident type"
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="DAMAGED_PACKAGE">Damaged package</MenuItem>
              <MenuItem value="LOST_PACKAGE">Lost package</MenuItem>
              <MenuItem value="WRONG_ADDRESS">Wrong address</MenuItem>
              <MenuItem value="DELIVERY_DELAY">Delivery delay</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              margin="normal"
            />

            <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
              Location
            </Typography>

            <LocationPicker value={location} onChange={setLocation} />

            {location && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Latitude: {location.latitude}
                <br />
                Longitude: {location.longitude}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                width: "100%",
              }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
              >
                Add evidence
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleEvidenceChange}
                />
              </Button>

              {form.evidence && (
                <img
                  src={form.evidence}
                  alt="Evidence image"
                  style={{ maxWidth: "40%" }}
                />
              )}
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Reporting..." : "Report incident"}
            </Button>
          </Box>

          {message && (
            <Alert
              severity={
                message === "Incident reported successfully."
                  ? "success"
                  : "error"
              }
              sx={{ mt: 3 }}
            >
              {message}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateIncidentReport;
