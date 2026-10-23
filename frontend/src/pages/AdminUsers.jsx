import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api.js";
import { isPasswordValid, PASSWORD_MESSAGE } from "../utils/passwordRules";

const ROLES = [
    { value: "ADMIN", label: "Administrador" },
    { value: "CLIENTE_EMISOR", label: "Cliente emisor" },
    { value: "REPARTIDOR", label: "Repartidor" },
    { value: "CLIENTE_RECEPTOR", label: "Cliente receptor" },
];

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
    name: "",
    email: "",
    password: "",
    role: "CLIENTE_EMISOR",
};

const validate = ({ name, email, password }) => {
    const errors = {};
    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
        errors.name = "El nombre debe tener entre 2 y 100 caracteres";
    } else if (!NAME_PATTERN.test(trimmedName)) {
        errors.name =
            "El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
        errors.email = "El correo no tiene un formato válido";
    }
    if (!isPasswordValid(password)) {
        errors.password = PASSWORD_MESSAGE;
    }
    return errors;
};

const AdminUsers = () => {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [dialogError, setDialogError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadUsers = async () => {
            try {
                const response = await api("/admin/users");

                if (response.status === 401 || response.status === 403) {
                    throw new Error("No tienes permiso para ver esta página.");
                }
                if (!response.ok) {
                    throw new Error("No se pudo cargar la lista de usuarios.");
                }

                const data = await response.json();
                if (!cancelled) setUsers(data);
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

        loadUsers();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRoleChange = async (user, role) => {
        setError("");

        try {
            const response = await api(`/admin/users/${user.id}/role`, {
                method: "PUT",
                body: JSON.stringify({ role }),
            });

            if (!response.ok) {
                throw new Error("Solicitud fallida");
            }

            const updated = await response.json();
            setUsers((current) =>
                current.map((item) => (item.id === updated.id ? updated : item)),
            );
        } catch {
            setError("No se pudo cambiar el rol. Inténtalo de nuevo.");
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`¿Eliminar a ${user.name}? No se puede deshacer.`)) {
            return;
        }

        setError("");

        try {
            const response = await api(`/admin/users/${user.id}`, {
                method: "DELETE",
            });

            if (!response.ok && response.status !== 404) {
                throw new Error("Solicitud fallida");
            }

            setUsers((current) => current.filter((item) => item.id !== user.id));
        } catch {
            setError("No se pudo eliminar el usuario. Inténtalo de nuevo.");
        }
    };

    const openDialog = () => {
        setForm(EMPTY_FORM);
        setFieldErrors({});
        setDialogError("");
        setDialogOpen(true);
    };

    const handleFormChange = (field) => (event) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        const errors = validate(form);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        setDialogError("");

        try {
            const response = await api("/admin/users", {
                method: "POST",
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: form.role,
                }),
            });

            if (response.status === 409) {
                throw new Error("Ya existe un usuario con ese correo.");
            }
            if (!response.ok) {
                throw new Error("No se pudo crear el usuario.");
            }

            const created = await response.json();
            setUsers((current) => [...current, created]);
            setDialogOpen(false);
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

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 6 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h4" component="h1">
                            Administración de usuarios
                        </Typography>
                        <Button variant="contained" onClick={openDialog}>
                            Crear usuario
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && users.length === 0 && !error && (
                        <Typography color="text.secondary">
                            No hay usuarios registrados.
                        </Typography>
                    )}

                    {!loading && users.length > 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Correo</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => {
                                        const isSelf = user.id === currentUser?.id;

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        size="small"
                                                        value={user.role}
                                                        disabled={isSelf}
                                                        onChange={(event) =>
                                                            handleRoleChange(user, event.target.value)
                                                        }
                                                    >
                                                        {ROLES.map((role) => (
                                                            <MenuItem key={role.value} value={role.value}>
                                                                {role.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        component={RouterLink}
                                                        to={`/profile/${user.id}`}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Perfil
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        size="small"
                                                        disabled={isSelf}
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={handleCreate} noValidate>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Nombre"
                            value={form.name}
                            onChange={handleFormChange("name")}
                            error={Boolean(fieldErrors.name)}
                            helperText={fieldErrors.name}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Correo electrónico"
                            type="email"
                            value={form.email}
                            onChange={handleFormChange("email")}
                            error={Boolean(fieldErrors.email)}
                            helperText={fieldErrors.email}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={form.password}
                            onChange={handleFormChange("password")}
                            error={Boolean(fieldErrors.password)}
                            helperText={fieldErrors.password}
                            autoComplete="new-password"
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Rol"
                            value={form.role}
                            onChange={handleFormChange("role")}
                            margin="normal"
                        >
                            {ROLES.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {dialogError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {dialogError}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? "Creando..." : "Crear"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Container>
    );
};

export default AdminUsers;
