const ROLE_LABELS = {
  ADMIN: "Administrador",
  REPARTIDOR: "Repartidor",
  CLIENTE_EMISOR: "Cliente emisor",
  CLIENTE_RECEPTOR: "Cliente receptor",
};

export const roleLabel = (role) => ROLE_LABELS[role] ?? role ?? "";
