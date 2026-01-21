# Documentación del Proyecto - Julieta Arena

Este directorio contiene toda la documentación del proyecto organizada por categorías.

## 📚 Índice de Documentación

### Guías Principales

- **[GUIA_AUTENTICACION.md](guias/GUIA_AUTENTICACION.md)** - Guía completa de autenticación y gestión de usuarios
- **[GUIA_ANALYTICS.md](guias/GUIA_ANALYTICS.md)** - Configuración y uso de Google Analytics
- **[GUIA_NOTIFICACIONES_EMAIL.md](guias/GUIA_NOTIFICACIONES_EMAIL.md)** - Sistema de notificaciones por email
- **[GUIA_NOTIFICACIONES_PUSH.md](guias/GUIA_NOTIFICACIONES_PUSH.md)** - Notificaciones push del navegador
- **[GUIA_SUPABASE_BACKEND.md](guias/GUIA_SUPABASE_BACKEND.md)** - Configuración y uso de Supabase
- **[GUIA_TESTING.md](guias/GUIA_TESTING.md)** - Guía de testing con Jest
- **[GUIA-VISUAL.md](guias/GUIA-VISUAL.md)** - Guía de diseño visual y personalización
- **[GOOGLE_MAPS_SETUP.md](guias/GOOGLE_MAPS_SETUP.md)** - Configuración de Google Maps API

### Configuración

- **[CONFIGURACION-EMAILJS.md](configuracion/CONFIGURACION-EMAILJS.md)** - Configuración de EmailJS para formularios
- **[CONFIGURACION_SUPABASE_STORAGE.md](configuracion/CONFIGURACION_SUPABASE_STORAGE.md)** - Configuración de almacenamiento en Supabase

### Setup y Mantenimiento

- **[AGREGAR_COORDENADAS_MAPA.md](setup/AGREGAR_COORDENADAS_MAPA.md)** - Cómo agregar coordenadas a propiedades
- **[AGREGAR_PROPIEDADES.md](setup/AGREGAR_PROPIEDADES.md)** - Guía para agregar nuevas propiedades
- **[IMAGENES-PROPIEDADES.md](setup/IMAGENES-PROPIEDADES.md)** - Gestión de imágenes de propiedades
- **[LIMPIAR_PROPIEDADES_CLOUDINARY.md](setup/LIMPIAR_PROPIEDADES_CLOUDINARY.md)** - Limpieza de imágenes en Cloudinary

### Documentación General

- **[ANALISIS_PROYECTO.md](ANALISIS_PROYECTO.md)** - Análisis técnico completo del proyecto
- **[PANEL_ADMIN_COMPLETO.md](PANEL_ADMIN_COMPLETO.md)** - Documentación del panel de administración
- **[PAGINA_DETALLES_PROPIEDAD.md](PAGINA_DETALLES_PROPIEDAD.md)** - Documentación de la página de detalles
- **[MEJORAS_UX_AVANZADAS.md](MEJORAS_UX_AVANZADAS.md)** - Mejoras de experiencia de usuario
- **[OPTIMIZACIONES_GOOGLE_MAPS.md](OPTIMIZACIONES_GOOGLE_MAPS.md)** - Optimizaciones de Google Maps
- **[CREDENCIALES_ADMIN.md](CREDENCIALES_ADMIN.md)** - Credenciales y acceso al panel admin
- **[INSTRUCCIONES.md](INSTRUCCIONES.md)** - Instrucciones generales del proyecto
- **[EMAILJS_SETUP.md](EMAILJS_SETUP.md)** - Setup de EmailJS
- **[SETUP_EMAIL_NOTIFICATIONS_README.md](SETUP_EMAIL_NOTIFICATIONS_README.md)** - Setup de notificaciones por email

### Archivo Histórico

Esta sección contiene documentación histórica de debugging y fixes que ya fueron resueltos.

#### Debugging
- **[DEBUG_CREAR_PROPIEDAD.md](archivo/debugging/DEBUG_CREAR_PROPIEDAD.md)** - Debugging de creación de propiedades
- **[DEBUG_GUARDADO_AUTOMATICO.md](archivo/debugging/DEBUG_GUARDADO_AUTOMATICO.md)** - Debugging de guardado automático

#### Fixes
- **[FIX_ERROR_CREAR_PROPIEDAD.md](archivo/fixes/FIX_ERROR_CREAR_PROPIEDAD.md)** - Fix de error al crear propiedades
- **[FIX_MANIFEST_ICONS.md](archivo/fixes/FIX_MANIFEST_ICONS.md)** - Fix de iconos PWA
- **[FIX_SERVICE_WORKER.md](archivo/fixes/FIX_SERVICE_WORKER.md)** - Fix de Service Worker
- **[FIX_SUPABASE_CURRENCY.md](archivo/fixes/FIX_SUPABASE_CURRENCY.md)** - Fix de moneda en Supabase
- **[FIX_SUPABASE_PERMISSIONS.md](archivo/fixes/FIX_SUPABASE_PERMISSIONS.md)** - Fix de permisos en Supabase

#### Otros
- **[ERRORES_SOLUCIONADOS.md](archivo/ERRORES_SOLUCIONADOS.md)** - Lista de errores resueltos
- **[WEBPACK_FIX_RESUMEN.md](archivo/WEBPACK_FIX_RESUMEN.md)** - Resumen de fixes de Webpack
- **[WEBPACK_WARNING.md](archivo/WEBPACK_WARNING.md)** - Advertencias de Webpack
- **[ESTADOS_UX.md](archivo/ESTADOS_UX.md)** - Estados de UX
- **[GUARDADO_AUTOMATICO_FORMULARIO.md](archivo/GUARDADO_AUTOMATICO_FORMULARIO.md)** - Guardado automático de formularios

## 📁 Estructura de Carpetas

```
docs/
├── guias/              # Guías principales de uso
├── configuracion/      # Archivos de configuración
├── setup/             # Guías de setup y mantenimiento
├── archivo/           # Documentación histórica
│   ├── debugging/     # Logs de debugging
│   └── fixes/         # Documentación de fixes aplicados
└── README.md          # Este archivo
```

## 🔍 Scripts SQL

Los scripts SQL están organizados en `scripts/sql/`:

- **setup/** - Scripts de configuración inicial
  - `CREATE_CONTACT_INQUIRIES_TABLE.sql`
  - `CREATE_PROPERTY_INQUIRIES_TABLE.sql`
  - `SETUP_EMAIL_NOTIFICATIONS.sql.example`
  - `fix-user-tracking.sql`
  - `supabase-setup.sql`
  - `supabase-storage-setup.sql`

- **migrations/** - Scripts de migración de datos
  - `UPDATE_COORDENADAS_PROPIEDADES.sql`

## 📝 Notas

- La documentación en `archivo/` es histórica y se mantiene solo como referencia
- Los scripts SQL con datos sensibles están en `.gitignore`
- Para más información sobre el proyecto, consulta el [README.md](../README.md) principal


