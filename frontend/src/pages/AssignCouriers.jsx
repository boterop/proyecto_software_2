import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "@services/api.js";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "ASSIGNED", label: "Asignado" },
  { value: "IN_TRANSIT", label: "En tránsito" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_LABELS = {
  PENDING: "Pendiente",
  ASSIGNED: "Asignado",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS = {
  PENDING: "warning",
  ASSIGNED: "info",
  IN_TRANSIT: "primary",
  DELIVERED: "success",
  CANCELLED: "default",
};

const readDetail = async (response, fallback) => {
  try {
    const body = await response.json();
    if (body && body.detail) {
      return body.detail;
    }
  } catch {
    // la respuesta no trae JSON
  }
  return fallback;
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-CO");
};

const AssignCouriers = () => {
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isReassign, setIsReassign] = useState(false);
  const [courierId, setCourierId] = useState("");
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [saving, setSaving] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyShipment, setHistoryShipment] = useState(null);

  const courierName = (id) => {
    if (!id) return "Sin asignar";
    const courier = couriers.find((item) => item.id === id);
    return courier ? courier.name : `Repartidor #${id}`;
  };

  const loadCouriers = async () => {
    const response = await api("/admin/couriers");
    if (!response.ok) {
      throw new Error(
        await readDetail(response, "No se pudo cargar la lista de repartidores."),
      );
    }
    return response.json();
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [shipmentsResponse, couriersResponse] = await Promise.all([
          api("/shipments"),
          api("/admin/couriers"),
        ]);

        if (
          shipmentsResponse.status === 401 ||
          shipmentsResponse.status === 403 ||
          couriersResponse.status === 401 ||
          couriersResponse.status === 403
        ) {
          throw new Error("No tienes permiso para ver esta página.");
        }

        if (!shipmentsResponse.ok) {
          throw new Error(
            await readDetail(
              shipmentsResponse,
              "No se pudo cargar la lista de envíos.",
            ),
          );
        }
        if (!couriersResponse.ok) {
          throw new Error(
            await readDetail(
              couriersResponse,
              "No se pudo cargar la lista de repartidores.",
            ),
          );
        }

        const shipmentsData = await shipmentsResponse.json();
        const couriersData = await couriersResponse.json();
        if (!cancelled) {
          setShipments(shipmentsData);
          setCouriers(couriersData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof TypeError
              ? "No se pudo conectar con el servidor. Inténtalo de nuevo."
              : err.message,
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const openAssignDialog = (shipment, reassign) => {
    setSelectedShipment(shipment);
    setIsReassign(reassign);
    setCourierId("");
    setReason("");
    setDialogError("");
    setSuccess("");
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    if (saving) return;
    setAssignDialogOpen(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setDialogError("");

    if (!courierId) {
      setDialogError("Debes seleccionar un repartidor.");
      return;
    }

    if (isReassign && !reason.trim()) {
      setDialogError("El motivo es obligatorio al reasignar.");
      return;
    }

    if (reason.length > 200) {
      setDialogError("El motivo no puede pasar de 200 caracteres.");
      return;
    }

    setSaving(true);

    try {
      const path = isReassign
        ? `/admin/shipments/${selectedShipment.id}/reassign`
        : `/admin/shipments/${selectedShipment.id}/assign`;

      const response = await api(path, {
        method: isReassign ? "PUT" : "POST",
        body: JSON.stringify({
          courierId: Number(courierId),
          reason: reason.trim() === "" ? null : reason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          await readDetail(response, "No se pudo guardar la asignación."),
        );
      }

      const updated = await response.json();
      setShipments((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );

      const nextCouriers = await loadCouriers();
      setCouriers(nextCouriers);

      setAssignDialogOpen(false);
      setSuccess(
        isReassign
          ? "El envío se reasignó correctamente."
          : "El envío se asignó correctamente.",
      );
    } catch (err) {
      setDialogError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor. Inténtalo de nuevo."
          : err.message,
      );
    } finally {
      setSaving(false);
    }
  };

  const openHistory = async (shipment) => {
    setHistoryShipment(shipment);
    setHistory([]);
    setHistoryError("");
    setHistoryOpen(true);
    setHistoryLoading(true);

    try {
      const response = await api(
        `/admin/shipments/${shipment.id}/assignments`,
      );

      if (!response.ok) {
        throw new Error(
          await readDetail(response, "No se pudo cargar el historial."),
        );
      }

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setHistoryError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor. Inténtalo de nuevo."
          : err.message,
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const visibleShipments = statusFilter
    ? shipments.filter((shipment) => shipment.status === statusFilter)
    : shipments;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Asignar repartidores
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <FormControl size="small" sx={{ mb: 2, minWidth: 220 }}>
              <InputLabel id="status-filter-label">Estado</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Estado"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {!loading && visibleShipments.length === 0 && !error && (
            <Typography color="text.secondary">
              No hay envíos para mostrar.
            </Typography>
          )}

          {!loading && visibleShipments.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Origen</TableCell>
                    <TableCell>Destino</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Repartidor</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>{shipment.trackingCode}</TableCell>
                      <TableCell>{shipment.originAddress}</TableCell>
                      <TableCell>{shipment.destinationAddress}</TableCell>
                      <TableCell>
                        <Chip
                          label={STATUS_LABELS[shipment.status] || shipment.status}
                          size="small"
                          color={STATUS_COLORS[shipment.status] || "default"}
                        />
                      </TableCell>
                      <TableCell>{courierName(shipment.courierId)}</TableCell>
                      <TableCell align="right">
                        {shipment.status === "PENDING" && (
                          <Button
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => openAssignDialog(shipment, false)}
                          >
                            Asignar
                          </Button>
                        )}
                        {shipment.status === "ASSIGNED" && (
                          <Button
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => openAssignDialog(shipment, true)}
                          >
                            Reasignar
                          </Button>
                        )}
                        <Button
                          size="small"
                          onClick={() => openHistory(shipment)}
                        >
                          Historial
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog
        open={assignDialogOpen}
        onClose={closeAssignDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSave} noValidate>
          <DialogTitle>
            {isReassign ? "Reasignar repartidor" : "Asignar repartidor"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Envío {selectedShipment?.trackingCode}
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="courier-select-label">Repartidor</InputLabel>
              <Select
                labelId="courier-select-label"
                label="Repartidor"
                value={courierId}
                onChange={(event) => setCourierId(event.target.value)}
              >
                <MenuItem value="">
                  <em>Selecciona un repartidor</em>
                </MenuItem>
                {couriers.map((courier) => {
                  const isCurrent =
                    selectedShipment && courier.id === selectedShipment.courierId;
                  return (
                    <MenuItem
                      key={courier.id}
                      value={courier.id}
                      disabled={!courier.available || isCurrent}
                    >
                      {courier.name} ({courier.activeShipments}/5)
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Motivo"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              margin="normal"
              required={isReassign}
              inputProps={{ maxLength: 200 }}
              helperText={
                isReassign
                  ? "Obligatorio al reasignar (máximo 200 caracteres)"
                  : "Opcional (máximo 200 caracteres)"
              }
            />

            {dialogError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {dialogError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAssignDialog} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Historial de asignaciones
          {historyShipment ? ` · ${historyShipment.trackingCode}` : ""}
        </DialogTitle>
        <DialogContent>
          {historyLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {historyError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {historyError}
            </Alert>
          )}

          {!historyLoading && !historyError && history.length === 0 && (
            <Typography color="text.secondary">
              Este envío no tiene asignaciones registradas.
            </Typography>
          )}

          {!historyLoading && history.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Repartidor anterior</TableCell>
                    <TableCell>Nuevo repartidor</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Asignado por</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        {item.previousCourierId
                          ? courierName(item.previousCourierId)
                          : "—"}
                      </TableCell>
                      <TableCell>{courierName(item.newCourierId)}</TableCell>
                      <TableCell>{item.reason || "—"}</TableCell>
                      <TableCell>{item.assignedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignCouriers;
