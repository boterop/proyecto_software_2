import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/users`);

                if (!response.ok) {
                    throw new Error("Could not load the users.");
                }

                const data = await response.json();
                if (!cancelled) setUsers(data);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof TypeError
                            ? "Could not reach the server. Please try again."
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

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;

        setError("");

        try {
            const response = await fetch(`${API_URL}/admin/users/${user.id}`, {
                method: "DELETE",
            });

            if (!response.ok && response.status !== 404) {
                throw new Error("Request failed");
            }

            setUsers((current) => current.filter((item) => item.id !== user.id));
        } catch {
            setError("Could not delete the user. Please try again.");
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 6 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        User administration
                    </Typography>

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
                        <Typography color="text.secondary">No users found.</Typography>
                    )}

                    {!loading && users.length > 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    component={RouterLink}
                                                    to={`/profile/${user.id}`}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    Profile
                                                </Button>
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    Delete
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
        </Container>
    );
};

export default AdminUsers;
