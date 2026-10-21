import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationPicker from "../components/LocationPicker";

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
          fetch(`${API_URL}/deliveries`),
          fetch(`${API_URL}/users`),
        ]);

        if (!deliveriesResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to load data");
        }

        setDeliveries(await deliveriesResponse.json());
        setUsers(await usersResponse.json());
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
      const response = await fetch(`${API_URL}/incident-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          location: `${location.latitude},${location.longitude}`,
          deliveryId: Number(form.deliveryId),
          userId: Number(form.userId),
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident report");
      }

      setMessage("Incident reported successfully.");

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
      setForm((current) => ({
        ...current,
        evidence: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

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
            <TextField
              fullWidth
              required
              select
              label="Delivery"
              name="deliveryId"
              value={form.deliveryId}
              onChange={handleChange}
              margin="normal"
            >
              {deliveries.map((delivery) => (
                <MenuItem key={delivery.id} value={delivery.id}>
                  {`Delivery #${delivery.id}`}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              required
              select
              label="User"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              margin="normal"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username} - {user.email}
                </MenuItem>
              ))}
            </TextField>

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

            <Box sx={{ mt: 2 }}>
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontWeight: "bold" }}
                >
                  Evidence image selected
                </Typography>
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
