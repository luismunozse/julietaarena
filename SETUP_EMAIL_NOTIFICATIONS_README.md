# Configuración de Notificaciones por Email - SQL Setup

## ⚠️ IMPORTANTE - Seguridad

El archivo `SETUP_EMAIL_NOTIFICATIONS.sql` ha sido agregado al `.gitignore` para **evitar exponer claves sensibles** en el repositorio.

## Cómo usar este archivo

### 1. Crear el archivo con tus credenciales

```bash
cp SETUP_EMAIL_NOTIFICATIONS.sql.example SETUP_EMAIL_NOTIFICATIONS.sql
```

### 2. Editar el archivo con tus valores reales

Abre `SETUP_EMAIL_NOTIFICATIONS.sql` y reemplaza:

- **YOUR_PROJECT_REF**: Tu Project Reference ID de Supabase (ej: `hrpkcdzgbpzzatusmqyq`)
- **YOUR_SUPABASE_ANON_KEY**: Tu Anon Key de Supabase

**Dónde encontrar estos valores:**
1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - Project URL → extrae el `PROJECT_REF` de la URL
   - anon/public key

### 3. Ejecutar el SQL en Supabase

1. Ve a Supabase Dashboard → **SQL Editor**
2. Click en **New query**
3. Copia todo el contenido de tu archivo `SETUP_EMAIL_NOTIFICATIONS.sql`
4. Pégalo en el editor
5. Click en **Run**

### 4. NO subir a Git

El archivo `SETUP_EMAIL_NOTIFICATIONS.sql` con tus credenciales **NO debe ser commiteado** a Git.

**Verificar que está ignorado:**
```bash
git status
# No debería aparecer SETUP_EMAIL_NOTIFICATIONS.sql
```

Si aparece, verifica que `.gitignore` tenga:
```
# SQL scripts with sensitive data
SETUP_EMAIL_NOTIFICATIONS.sql
```

## Archivos de este proyecto

- `SETUP_EMAIL_NOTIFICATIONS.sql.example` - Template sin claves (SÍ se commitea)
- `SETUP_EMAIL_NOTIFICATIONS.sql` - Archivo con tus claves (NO se commitea, en .gitignore)
- `.gitignore` - Incluye `SETUP_EMAIL_NOTIFICATIONS.sql`

## Para otros desarrolladores

Si clonas este repositorio:

1. Copia el archivo example: `cp SETUP_EMAIL_NOTIFICATIONS.sql.example SETUP_EMAIL_NOTIFICATIONS.sql`
2. Pide las credenciales al propietario del proyecto
3. Edita el archivo con las credenciales reales
4. Ejecuta el SQL en Supabase

---

**Nota sobre seguridad:**
El `anon key` de Supabase está diseñado para ser usado en aplicaciones frontend y tiene permisos limitados por las Row Level Security (RLS) policies. Sin embargo, es mejor práctica no exponerlo innecesariamente en repositorios públicos.
