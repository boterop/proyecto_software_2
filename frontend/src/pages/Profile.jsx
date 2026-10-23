import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api.js";

const PHONE_REGEX = /^[0-9+ ()-]{7,20}$/;

const validate = ({ phone, address, city }) => {
    const errors = {};
    if (phone.trim() && !PHONE_REGEX.test(phone.trim())) {
        errors.phone = "El teléfono no es válido";
    }
    if (address.length > 200) {
        errors.address = "La dirección es demasiado larga";
    }
    if (city.length > 100) {
        errors.city = "La ciudad es demasiado larga";
    }
    return errors;
};

const Profile = () => {
    // /profile abre el perfil propio; /profile/:userId lo usa el administrador.
    const { userId: routeUserId } = useParams();
    const { user: authUser, loading: authLoading } = useAuth();
    const userId = routeUserId ?? authUser?.id;

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ phone: "", address: "", city: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        const loadProfile = async () => {
            try {
                const response = await api(`/user-profiles/${userId}`);

                if (response.status === 401 || response.status === 403) {
                    throw new Error("No tienes permiso para ver este perfil.");
                }
                if (response.status === 404) {
                    throw new Error("Usuario no encontrado.");
                }
                if (!response.ok) {
                    throw new Error("No se pudo cargar el perfil.");
                }

                const data = await response.json();
                if (cancelled) return;

                setUser({ name: data.name, email: data.email });
                setForm({
                    phone: data.phone ?? "",
                    address: data.address ?? "",
                    city: data.city ?? "",
                });
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

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const handleChange = (field) => (event) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validate(form);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await api(`/user-profiles/${userId}`, {
                method: "PUT",
                // Los campos vacíos se envían como null para que el backend no los valide.
                body: JSON.stringify({
                    phone: form.phone.trim() || null,
                    address: form.address.trim() || null,
                    city: form.city.trim() || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            setSuccess("Perfil actualizado correctamente.");
        } catch {
            setError("Algo salió mal. Inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    const showSpinner = authLoading || (loading && !error);

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
                        Mi perfil
                    </Typography>

                    {showSpinner && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!showSpinner && !user && error && (
                        <Alert severity="error">{error}</Alert>
                    )}

                    {!showSpinner && user && (
                        <>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Actualiza tu información de contacto.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={user.name}
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Correo electrónico"
                                    value={user.email}
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    error={Boolean(fieldErrors.phone)}
                                    helperText={fieldErrors.phone}
                                    autoComplete="tel"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    error={Boolean(fieldErrors.address)}
                                    helperText={fieldErrors.address}
                                    autoComplete="street-address"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Ciudad"
                                    value={form.city}
                                    onChange={handleChange("city")}
                                    error={Boolean(fieldErrors.city)}
                                    helperText={fieldErrors.city}
                                    autoComplete="address-level2"
                                    margin="normal"
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={saving}
                                    sx={{ mt: 2 }}
                                >
                                    {saving ? "Guardando..." : "Guardar cambios"}
                                </Button>
                            </Box>

                            {success && (
                                <Alert severity="success" sx={{ mt: 3 }}>
                                    {success}
                                </Alert>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mt: 3 }}>
                                    {error}
                                </Alert>
                            )}
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
