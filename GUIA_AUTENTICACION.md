# Guía de Autenticación del Panel de Administración

## Sistema de Autenticación Implementado

El panel de administración ahora está completamente protegido con autenticación mediante Supabase Auth. Todas las rutas bajo `/admin/*` requieren que el usuario esté autenticado.

## Componentes del Sistema

### 1. Layout de Administración (`/src/app/admin/layout.tsx`)

Este layout protege **todas** las rutas de administración automáticamente:

- ✅ Verifica si el usuario está autenticado
- ✅ Redirige a `/login` si no hay sesión activa
- ✅ Muestra un loading mientras verifica la sesión
- ✅ Proporciona una barra superior con:
  - Indicador de sesión activa
  - Nombre/email del usuario
  - Navegación rápida (Propiedades, Analytics, Ver sitio)
  - Botón de cierre de sesión

### 2. Página de Login (`/src/app/login/page.tsx`)

Interfaz de inicio de sesión con:
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Redirección automática después del login
- ✅ Parámetro `redirect` para volver a la página solicitada

### 3. Hook de Autenticación (`/src/hooks/useAuth.ts`)

Proporciona funciones para:
- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `register(data)` - Registrar nuevo usuario
- `isAuthenticated` - Estado de autenticación
- `user` - Datos del usuario actual
- `session` - Información de la sesión

## Cómo Acceder al Panel de Administración

### Paso 1: Crear usuario administrador en Supabase

Si aún no tienes un usuario administrador:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Click en **Add User**
5. Completa:
   - **Email**: tu correo de administrador
   - **Password**: una contraseña segura (mínimo 6 caracteres)
   - **Auto Confirm User**: ✅ Activar (para no requerir confirmación por email)
6. Click en **Create user**

**Credenciales recomendadas para desarrollo**:
```
Email: admin@julietaarena.com.ar
Password: [una contraseña segura]
```

### Paso 2: Acceder al panel

1. Abre tu navegador y ve a: `http://localhost:3000/login`
2. Ingresa tus credenciales:
   - Email del usuario creado en Supabase
   - Contraseña
3. Click en **🔐 Iniciar Sesión**

### Paso 3: Navegar por el panel

Una vez autenticado, verás:

- **Barra superior verde** con:
  - 🔐 Panel de Administración
  - 👤 Tu nombre/email
  - 🏠 Propiedades - Gestionar todas las propiedades
  - 📊 Analytics - Ver métricas del sitio
  - 🌐 Ver sitio - Ir al sitio público
  - 🚪 Cerrar sesión

- **Contenido principal** según la ruta:
  - `/admin/propiedades` - Lista de propiedades con filtros
  - `/admin/propiedades/nueva` - Crear nueva propiedad
  - `/admin/propiedades/[id]` - Editar propiedad existente
  - `/admin/analytics` - Dashboard de analytics

## Flujo de Autenticación

### Acceso Directo a Ruta Protegida

```
Usuario intenta acceder a: /admin/propiedades
  ↓
¿Está autenticado?
  ├─ NO → Redirige a /login?redirect=/admin/propiedades
  │        ↓
  │      Usuario ingresa credenciales
  │        ↓
  │      Login exitoso
  │        ↓
  │      Redirige a /admin/propiedades (ruta original)
  │
  └─ SÍ → Muestra /admin/propiedades directamente
```

### Cierre de Sesión

```
Usuario hace click en "Cerrar sesión"
  ↓
Confirmación: "¿Estás seguro?"
  ↓
Llama a logout() de useAuth
  ↓
Supabase cierra la sesión
  ↓
Redirige a /login
```

## Protección de Rutas

### Rutas Protegidas (requieren autenticación)

- ✅ `/admin/propiedades` - Listar propiedades
- ✅ `/admin/propiedades/nueva` - Crear propiedad
- ✅ `/admin/propiedades/[id]` - Editar propiedad
- ✅ `/admin/analytics` - Dashboard de analytics
- ✅ Cualquier ruta futura bajo `/admin/*`

### Rutas Públicas (no requieren autenticación)

- ✅ `/` - Página principal
- ✅ `/propiedades` - Búsqueda de propiedades
- ✅ `/propiedades/[id]` - Detalle de propiedad
- ✅ `/propiedades/resultado` - Resultados de búsqueda
- ✅ `/favoritos` - Favoritos del usuario
- ✅ `/login` - Página de login

## Gestión de Usuarios

### Crear Nuevo Administrador

**Opción 1: Desde Supabase Dashboard** (recomendado)
1. Supabase Dashboard → Authentication → Users
2. Add User
3. Completar datos y confirmar

**Opción 2: Desde la página de registro**
1. Ve a `/login`
2. Click en pestaña **Registrarse**
3. Completa el formulario
4. Click en **📝 Registrarse**

⚠️ **Nota**: Si el registro requiere confirmación por email, deberás configurar los emails en Supabase o confirmar manualmente desde el dashboard.

### Eliminar Usuario

1. Supabase Dashboard → Authentication → Users
2. Busca el usuario
3. Click en los tres puntos (...)
4. Delete user

### Cambiar Contraseña

**Desde Supabase Dashboard**:
1. Authentication → Users
2. Click en el usuario
3. Click en **Reset password**
4. Ingresa nueva contraseña
5. Save

## Seguridad

### Row Level Security (RLS)

Las tablas de Supabase están protegidas con políticas RLS que:
- ✅ Solo usuarios autenticados pueden crear/editar/eliminar propiedades
- ✅ Los campos `created_by` y `updated_by` se establecen automáticamente
- ✅ Las consultas públicas (sitio web) solo pueden leer propiedades disponibles

### Tokens y Sesiones

- ✅ Los tokens de sesión se almacenan en localStorage
- ✅ Los tokens expiran automáticamente después de 1 hora
- ✅ El sistema refresca el token automáticamente mientras el usuario está activo
- ✅ Al cerrar sesión, el token se invalida inmediatamente

## Solución de Problemas

### No puedo iniciar sesión

**Problema**: "Email o contraseña incorrectos"

**Soluciones**:
1. Verifica que el usuario existe en Supabase Dashboard
2. Verifica que el email está confirmado (Auto Confirm User)
3. Intenta resetear la contraseña desde Supabase Dashboard
4. Revisa la consola del navegador (F12) para ver errores

### La página se queda cargando

**Problema**: "Verificando sesión..." infinitamente

**Soluciones**:
1. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están en `.env.local`
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Limpia localStorage del navegador:
   ```javascript
   // En la consola del navegador
   localStorage.clear()
   location.reload()
   ```
4. Verifica que Supabase está funcionando correctamente

### Me redirige a login después de autenticarme

**Problema**: Bucle de redirección login → admin → login

**Soluciones**:
1. Limpia las cookies y localStorage del navegador
2. Verifica que no hay errores en la consola
3. Revisa que `useAuth` retorna `isAuthenticated: true`
4. Comprueba que el token de Supabase es válido

### No veo el botón de cerrar sesión

**Problema**: La barra de admin no aparece

**Soluciones**:
1. Verifica que estás en una ruta bajo `/admin/*`
2. Comprueba que el layout se está renderizando (inspecciona el HTML)
3. Revisa los estilos CSS del layout
4. Limpia caché del navegador: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

## Configuración de Desarrollo

### Variables de Entorno Requeridas

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Verificar Configuración

```bash
# Verificar que las variables están cargadas
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver logs del servidor
# Los logs de autenticación aparecerán con prefijos:
# 🔒 - Redirección a login
# 🚪 - Cierre de sesión
# ✅ - Autenticación exitosa
```

## Archivos Relacionados

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # ← LAYOUT DE PROTECCIÓN
│   │   ├── layout.module.css       # ← ESTILOS DEL LAYOUT
│   │   ├── propiedades/
│   │   │   ├── page.tsx            # Lista de propiedades
│   │   │   ├── nueva/page.tsx      # Crear propiedad
│   │   │   └── [id]/page.tsx       # Editar propiedad
│   │   └── analytics/
│   │       └── page.tsx            # Analytics
│   └── login/
│       ├── page.tsx                # ← PÁGINA DE LOGIN
│       └── page.module.css
├── components/
│   └── AuthProvider.tsx            # Provider de autenticación
├── hooks/
│   └── useAuth.ts                  # ← HOOK DE AUTENTICACIÓN
└── lib/
    └── supabaseClient.ts           # Cliente de Supabase
```

## Próximos Pasos

1. ✅ Crear usuario administrador en Supabase
2. ✅ Configurar variables de entorno
3. ✅ Iniciar sesión desde `/login`
4. ✅ Verificar acceso al panel de administración
5. ✅ Probar crear/editar/eliminar propiedades
6. ✅ Probar cerrar sesión

## Notas de Seguridad para Producción

Antes de desplegar a producción:

- [ ] Cambiar contraseñas de desarrollo por contraseñas seguras
- [ ] Habilitar confirmación por email en Supabase
- [ ] Configurar políticas RLS más estrictas si es necesario
- [ ] Implementar rate limiting para prevenir ataques de fuerza bruta
- [ ] Configurar 2FA (autenticación de dos factores) para administradores
- [ ] Revisar logs de autenticación regularmente
- [ ] Implementar roles y permisos si hay múltiples administradores
