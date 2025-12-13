# 🔐 Credenciales de Administración

## IMPORTANTE: Crear Usuario en Supabase Primero

El sistema de autenticación usa **Supabase Auth**, por lo que debes crear el usuario administrador en Supabase Dashboard antes de poder iniciar sesión.

---

## ✅ Paso 1: Crear Usuario Administrador en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto **Julieta Arena**
3. En el menú lateral, ve a **Authentication** → **Users**
4. Click en **Add User** (botón verde)
5. Completa el formulario:

   **Email**:
   ```
   admin@julietaarena.com.ar
   ```

   **Password**:
   ```
   Admin2024!
   ```
   (O cualquier contraseña segura de tu preferencia)

6. ✅ **MUY IMPORTANTE**: Activa la opción **Auto Confirm User**
   - Esto evita que tengas que confirmar el email manualmente
   - Sin esto, no podrás iniciar sesión

7. Click en **Create user**

---

## 🚀 Paso 2: Acceder al Panel de Administración

Una vez creado el usuario en Supabase:

1. **Ve a la página de login:**
   ```
   http://localhost:3000/login
   ```

   O simplemente intenta acceder a cualquier ruta de admin y serás redirigido:
   ```
   http://localhost:3000/admin/propiedades
   ```

2. **Ingresa las credenciales** que configuraste en Supabase:
   - Email: `admin@julietaarena.com.ar`
   - Contraseña: `Admin2024!` (o la que hayas elegido)

3. Click en **🔐 Iniciar Sesión**

4. **Serás redirigido automáticamente** al panel de administración

---

## 📊 Panel de Administración

Una vez autenticado, verás una **barra verde** en la parte superior con:

- 🔐 **Panel de Administración** - Indicador de que estás en el panel
- 👤 **Tu nombre/email** - Usuario actual
- 🏠 **Propiedades** - Gestionar propiedades
- 📊 **Analytics** - Ver métricas del sitio
- 🌐 **Ver sitio** - Ir al sitio público
- 🚪 **Cerrar sesión** - Salir del panel

---

## 🔄 Crear Usuarios Adicionales

### Opción 1: Desde Supabase Dashboard (Recomendado)

Repite el Paso 1 con un email diferente.

### Opción 2: Desde la página de registro

1. Ve a `http://localhost:3000/login`
2. Click en la pestaña **Registrarse**
3. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Teléfono (opcional)
4. Click en **📝 Registrarse**

⚠️ **Nota**: Si el registro requiere confirmación por email, deberás:
- Configurar emails en Supabase, O
- Confirmar manualmente desde Supabase Dashboard → Authentication → Users

---

## 🛡️ Seguridad del Sistema

### Protección de Rutas

Todas las rutas bajo `/admin/*` están **automáticamente protegidas**:

✅ **Rutas protegidas** (requieren login):
- `/admin/propiedades` - Lista de propiedades
- `/admin/propiedades/nueva` - Crear propiedad
- `/admin/propiedades/[id]` - Editar propiedad
- `/admin/analytics` - Dashboard de analytics
- Cualquier ruta futura bajo `/admin/*`

🌐 **Rutas públicas** (no requieren login):
- `/` - Página principal
- `/propiedades` - Búsqueda
- `/propiedades/[id]` - Detalle de propiedad
- `/favoritos` - Favoritos
- `/login` - Login

### Características de Seguridad

- ✅ Autenticación real con Supabase Auth
- ✅ Tokens JWT seguros
- ✅ Sesiones persistentes (no pierdes la sesión al recargar)
- ✅ Redirección automática a login si intentas acceder sin estar autenticado
- ✅ Redirección automática al panel después del login
- ✅ Row Level Security (RLS) en la base de datos
- ✅ Campos `created_by` y `updated_by` automáticos

---

## 🐛 Solución de Problemas

### ❌ Error: "Email o contraseña incorrectos"

**Causas posibles**:
1. El usuario no existe en Supabase
2. La contraseña es incorrecta
3. El usuario no está confirmado

**Soluciones**:
1. Ve a Supabase Dashboard → Authentication → Users
2. Verifica que el usuario existe
3. Verifica que **Email Confirmed** está en ✅ (verde)
4. Si no está confirmado, click en el usuario → Reset password → Save
5. Si el usuario no existe, créalo siguiendo el Paso 1

### ⏳ La página se queda en "Verificando sesión..."

**Causas posibles**:
1. Variables de entorno no configuradas
2. Supabase no está respondiendo
3. Error en la configuración de Supabase

**Soluciones**:
1. Verifica que `.env.local` tiene:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```
2. Reinicia el servidor: `npm run dev`
3. Abre la consola del navegador (F12) y busca errores
4. Verifica que Supabase está funcionando en el dashboard

### 🔄 Bucle de redirección (login → admin → login)

**Causas posibles**:
1. Token corrupto en localStorage
2. Sesión expirada
3. Error en la configuración de Auth

**Soluciones**:
1. Limpia localStorage:
   ```javascript
   // En la consola del navegador (F12)
   localStorage.clear()
   location.reload()
   ```
2. Cierra todas las pestañas del sitio
3. Vuelve a iniciar sesión

### 🚫 No puedo crear propiedades (Error de Supabase)

**Causa posible**:
- Los triggers de `created_by` y `updated_by` no están configurados

**Solución**:
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el script `scripts/fix-user-tracking.sql`
3. Verifica que se ejecutó sin errores
4. Intenta crear una propiedad nuevamente

### 👤 No veo mi nombre en la barra de admin

**Causa posible**:
- El usuario no tiene `name` en metadata

**Solución**:
1. Ve a Supabase Dashboard → Authentication → Users
2. Click en tu usuario
3. En **User Metadata** agrega:
   ```json
   {
     "name": "Tu Nombre"
   }
   ```
4. Save
5. Cierra sesión y vuelve a iniciar

---

## 📝 Verificación Rápida

### ✅ Checklist de Configuración

Antes de intentar iniciar sesión, verifica:

- [ ] Usuario creado en Supabase Dashboard
- [ ] Email confirmado (Auto Confirm User activado)
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Puedes acceder a `/login` sin errores

### ✅ Checklist de Login Exitoso

Después de iniciar sesión, deberías ver:

- [ ] Barra verde con "🔐 Panel de Administración"
- [ ] Tu nombre o email en la barra
- [ ] Botones de navegación (Propiedades, Analytics)
- [ ] Botón "🚪 Cerrar sesión"
- [ ] Contenido del panel (lista de propiedades, etc.)

---

## 🎯 Credenciales Recomendadas

### Para Desarrollo

```
Email: admin@julietaarena.com.ar
Password: Admin2024!
Nombre: Administrador
```

### Para Producción

⚠️ **IMPORTANTE**: Cambiar contraseña y usar credenciales seguras:

```
Email: [email corporativo real]
Password: [contraseña segura con mayúsculas, minúsculas, números y símbolos]
```

Recomendaciones para producción:
- Mínimo 12 caracteres
- Incluir mayúsculas, minúsculas, números y símbolos
- No usar palabras del diccionario
- Usar un gestor de contraseñas
- Habilitar 2FA si es posible

---

## 📚 Documentación Relacionada

- [GUIA_AUTENTICACION.md](./GUIA_AUTENTICACION.md) - Guía completa del sistema
- [GUIA_SUPABASE_BACKEND.md](./GUIA_SUPABASE_BACKEND.md) - Configuración de Supabase
- Documentación oficial: [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Última actualización**: 2025-01-09
