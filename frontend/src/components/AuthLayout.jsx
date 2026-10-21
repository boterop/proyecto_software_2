import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
import "../styles/auth.css";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="auth-page">
    <Container maxWidth="sm" className="auth-page__container">
      <Box className="auth-page__center">
        <Paper elevation={3} className="auth-card">
          <Typography variant="overline" className="auth-brand">
            UQ Delivery
          </Typography>
          <Typography variant="h4" component="h1" className="auth-card__title">
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" className="auth-card__subtitle">
              {subtitle}
            </Typography>
          )}
          <div className="auth-form">{children}</div>
          {footer && <div className="auth-card__footer">{footer}</div>}
        </Paper>
        <Typography variant="body2" color="text.secondary" className="auth-home-link">
          <Link component={RouterLink} to="/" underline="hover">
            Volver al inicio
          </Link>
        </Typography>
      </Box>
    </Container>
  </div>
);

export default AuthLayout;
