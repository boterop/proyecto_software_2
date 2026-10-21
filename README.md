[![Coverage Status](https://coveralls.io/repos/github/boterop/proyecto_software_2/badge.svg?branch=main)](https://coveralls.io/github/boterop/proyecto_software_2?branch=main)

# Enunciado del Proyecto: Sistema de Gestión de Logística y Entregas ("UQDelivery")

## 1. Descripción General del Proyecto

El objetivo de este proyecto es diseñar, documentar, desarrollar y probar una aplicación web completa para la gestión de envíos y entregas de paquetes en entornos urbanos.

La plataforma debe permitir a las empresas:

- Registrar solicitudes de envío.
- Asignar rutas optimizadas a los repartidores.
- Permitir que los clientes finales rastreen sus paquetes en tiempo real utilizando herramientas de geolocalización.

El sistema debe desarrollarse siguiendo principios de Ingeniería de Software, metodologías ágiles (Scrum), arquitectura limpia (p. ej., Modelo-Vista-Controlador o Arquitectura en Capas) y buenas prácticas de codificación.

---

## 2. Roles del Sistema (Actores)

Los estudiantes deberán implementar un control de acceso basado en roles (RBAC).

Se definen los siguientes perfiles:

### Administrador del Sistema

Se encarga de:

- La configuración global.
- Gestión de usuarios (repartidores y clientes corporativos).
- Visualización de métricas generales de rendimiento del negocio.

### Cliente Emisor (Corporativo/Particular)

Usuario que solicita los envíos. Puede:

- Registrar nuevos paquetes.
- Pagar el servicio.
- Consultar el historial de sus envíos.

### Repartidor

Usuario móvil/web que:

- Visualiza su lista de entregas asignadas.
- Actualiza el estado de los paquetes en tiempo real.
- Utiliza la navegación por mapa para llegar al destino.

### Cliente Receptor (Final)

Usuario sin necesidad de registro obligatorio que puede:

- Consultar el estado exacto de su paquete.
- Consultar la ubicación en vivo de su paquete mediante un código de seguimiento único.

---

## 3. Product Backlog

### Épica 1: Gestión de Usuarios y Autenticación

- **HU-01:** Registro e Inicio de Sesión Seguro
- **HU-02:** Gestión de Perfiles y Roles
- **HU-03:** Recuperación de Contraseña

### Épica 2: Gestión de Envíos y Pedidos y Ciclo de Vida de Paquetes

- **HU-04:** Creación de Solicitud de Envío
- **HU-05:** Cotización Automática de Envíos
- **HU-06:** Asignación y reasignación de Repartidores

### Épica 3: Geolocalización, Mapas y Rutas (Requisito de API)

- **HU-07:** Visualización de Ruta óptima del Repartidor
- **HU-08:** Rastreo en Vivo del Paquete
- **HU-09:** Panel de Control Geográfico (Monitoreo Global)

### Épica 4: Gestión de Novedades y Evidencia de Entrega

- **HU-10:** Reporte de Novedades en Ruta
- **HU-11:** Cierre de Entrega con Evidencia Digital

### Épica 5: Notificaciones y Alertas

- **HU-12:** Notificaciones por Cambio de Estado
- **HU-13:** Alerta de Cancelación de Envío

### Épica 6: Reportes, Historial y Analítica de Datos

- **HU-14:** Historial de Envíos Personalizado
- **HU-15:** Dashboard de Rendimiento y Métricas

---

## 4. Requisitos No Funcionales y Técnicos (Restricciones)

### Arquitectura

Separación estricta entre:

- **Frontend:** aplicación web SPA utilizando React, Angular o Vue.
- **Backend:** RESTful API utilizando Node.js, Python, Java, C#, etc.

### Base de Datos

Uso de bases de datos:

- Relacionales: PostgreSQL, MySQL.
- No relacionales: MongoDB.

Se debe justificar el diseño del esquema mediante diagramas (DER o diagramas de clases).

### Control de Versiones

Uso obligatorio de Git (GitHub/GitLab) utilizando una estrategia de ramificación clara, por ejemplo:

- Gitflow.
- Trunk-Based Development.

### Pruebas

Los estudiantes deben entregar un porcentaje mínimo de cobertura de pruebas unitarias, por ejemplo, **60-70% en el backend**.

### Seguridad

- Validación de datos tanto en el cliente (frontend) como en el servidor (backend).
- Protección contra inyecciones SQL.
- Protección contra XSS.

---

## 5. Otras Características

- Product Backlog inicializado en una herramienta de gestión (Jira, Trello o GitHub Projects).
- Modelado de base de datos implementado.
- Integración completa de la API de localización (mapas, rutas y simulación de rastreo).
- Despliegue de la aplicación en un entorno de producción o nube (Render, Railway, AWS, Vercel, etc.).
