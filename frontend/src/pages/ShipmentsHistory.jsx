import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { api } from "@services/api.js";

const ShipmentHistory = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    trackingCode: "",
    origin: "",
    destination: "",
    receiverName: "",
    status: "",
  });

  const [statuses] = useState([
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "delayed", label: "Delayed" },
    { value: "returned", label: "Returned" },
  ]);

  // Fetch shipments data
  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const response = await api(`/shipments`);
        if (!response.ok) {
          throw new Error("Failed to fetch shipments");
        }
        const data = await response.json();
        setShipments(data);
        setFilteredShipments(data);
      } catch (err) {
        setError("Error fetching shipments data");
        console.error("Error fetching shipments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = shipments;

    if (filters.trackingCode) {
      result = result.filter((shipment) =>
        shipment.trackingCode
          .toLowerCase()
          .includes(filters.trackingCode.toLowerCase()),
      );
    }

    if (filters.origin) {
      result = result.filter((shipment) =>
        shipment.originAddress
          .toLowerCase()
          .includes(filters.origin.toLowerCase()),
      );
    }

    if (filters.destination) {
      result = result.filter((shipment) =>
        shipment.destinationAddress
          .toLowerCase()
          .includes(filters.destination.toLowerCase()),
      );
    }

    if (filters.receiverName) {
      result = result.filter((shipment) =>
        shipment.receiverName
          .toLowerCase()
          .includes(filters.receiverName.toLowerCase()),
      );
    }

    if (filters.status) {
      result = result.filter((shipment) => 
        shipment.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredShipments(result);
  }, [filters, shipments]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      trackingCode: "",
      origin: "",
      destination: "",
      receiverName: "",
      status: "",
    });
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "pending":
        color = "warning";
        break;
      case "in_transit":
        color = "info";
        break;
      case "delivered":
        color = "success";
        break;
      case "delayed":
        color = "error";
        break;
      case "returned":
        color = "secondary";
        break;
      default:
        color = "default";
    }

    return <Chip label={status.replace("_", " ")} size="small" color={color} />;
  };

  const formatAddress = (address) => {
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const formatDimension = (value) => {
    return value === null || value === undefined ? "N/A" : value;
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shipment History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Tracking Code"
                  value={filters.trackingCode}
                  onChange={(e) =>
                    handleFilterChange("trackingCode", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Origin"
                  value={filters.origin}
                  onChange={(e) => handleFilterChange("origin", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Destination"
                  value={filters.destination}
                  onChange={(e) =>
                    handleFilterChange("destination", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Receiver Name"
                  value={filters.receiverName}
                  onChange={(e) =>
                    handleFilterChange("receiverName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button onClick={clearFilters} variant="outlined" fullWidth>
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking Code</TableCell>
                <TableCell>Origin</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Dimensions</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading shipments...
                  </TableCell>
                </TableRow>
              ) : filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {shipment.trackingCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatAddress(shipment.originAddress)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatAddress(shipment.destinationAddress)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {shipment.receiverName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDimension(shipment.lengthCm)} ×{" "}
                        {formatDimension(shipment.widthCm)} ×{" "}
                        {formatDimension(shipment.heightCm)} cm
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDimension(shipment.weightKg)} kg
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(shipment.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Total shipments: {filteredShipments.length}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipmentHistory;

