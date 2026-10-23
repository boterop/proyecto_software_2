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
import { useMemo } from "react";

const ShipmentHistory = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    trackingCode: "",
    origin: "",
    destination: "",
    receiverName: "",
    status: "",
  });

  const [statuses] = useState([
    { value: "", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "in_transit", label: "En tránsito" },
    { value: "delivered", label: "Entregado" },
    { value: "cancelled", label: "Cancelado" },
  ]);

  const filteredShipments = useMemo(() => {
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
      result = result.filter(
        (shipment) =>
          shipment.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    return result;
  }, [shipments, filters]);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const response = await api(`/shipments`);
        if (!response.ok) {
          throw new Error("Error al obtener los envíos");
        }
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        setError("Error al cargar los datos de envíos");
        console.error("Error fetching shipments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  useEffect(() => {}, [filters, shipments]);

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
    const colors = {
      pending: "warning",
      in_transit: "info",
      delivered: "success",
      delayed: "error",
      cancelled: "secondary",
    };

    const color = colors[status] || "default";

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
          Historial de envíos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Código de seguimiento"
                  value={filters.trackingCode}
                  onChange={(e) =>
                    handleFilterChange("trackingCode", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Origen"
                  value={filters.origin}
                  onChange={(e) => handleFilterChange("origin", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Destino"
                  value={filters.destination}
                  onChange={(e) =>
                    handleFilterChange("destination", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Nombre del receptor"
                  value={filters.receiverName}
                  onChange={(e) =>
                    handleFilterChange("receiverName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
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
                  Limpiar filtros
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código de seguimiento</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Receptor</TableCell>
                <TableCell>Dimensiones</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creado en</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Cargando envíos...
                  </TableCell>
                </TableRow>
              ) : filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No se encontraron envíos
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
            Total de envíos: {filteredShipments.length}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipmentHistory;
