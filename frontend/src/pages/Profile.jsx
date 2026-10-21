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

const PHONE_REGEX = /^[0-9+ ()-]{7,20}$/;

const validate = ({ phone, address, city }) => {
    const errors = {};
    if (phone.trim() && !PHONE_REGEX.test(phone.trim())) {
        errors.phone = "Phone is invalid";
    }
    if (address.length > 200) {
        errors.address = "Address is too long";
    }
    if (city.length > 100) {
        errors.city = "City is too long";
    }
    return errors;
};

const Profile = () => {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ phone: "", address: "", city: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/user-profiles/${userId}`);

                if (response.status === 404) {
                    throw new Error("User not found.");
                }
                if (!response.ok) {
                    throw new Error("Could not load the profile.");
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
                        err.message === "Failed to fetch"
                            ? "Could not reach the server. Please try again."
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
            const response = await fetch(`${API_URL}/user-profiles/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                // Empty fields are sent as null so the backend does not validate them.
                body: JSON.stringify({
                    phone: form.phone.trim() || null,
                    address: form.address.trim() || null,
                    city: form.city.trim() || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            setSuccess("Profile updated successfully.");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
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
                        My profile
                    </Typography>

                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !user && error && <Alert severity="error">{error}</Alert>}

                    {!loading && user && (
                        <>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Update your contact information.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={user.name}
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={user.email}
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    error={Boolean(fieldErrors.phone)}
                                    helperText={fieldErrors.phone}
                                    autoComplete="tel"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    error={Boolean(fieldErrors.address)}
                                    helperText={fieldErrors.address}
                                    autoComplete="street-address"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="City"
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
                                    {saving ? "Saving..." : "Save changes"}
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