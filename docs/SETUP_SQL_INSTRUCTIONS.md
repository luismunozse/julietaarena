# Instrucciones para Ejecutar Scripts SQL en Supabase

Este documento explica cómo ejecutar los scripts SQL necesarios para las funcionalidades avanzadas del panel admin.

## 📋 Requisitos Previos

1. Acceso a tu proyecto de Supabase
2. Permisos de administrador en Supabase
3. Las tablas base ya creadas (`property_inquiries`, `contact_inquiries`)

## 🚀 Opción 1: Ejecutar Script Consolidado (Recomendado)

### Paso 1: Abrir SQL Editor en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**

### Paso 2: Copiar y Ejecutar el Script

1. Abre el archivo `scripts/sql/setup_all_tables.sql`
2. Copia todo el contenido del archivo
3. Pega el contenido en el SQL Editor de Supabase
4. Haz clic en **Run** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Paso 3: Verificar la Ejecución

Deberías ver un mensaje de éxito indicando que todas las tablas y campos se crearon correctamente.

## 🔧 Opción 2: Ejecutar Scripts Individuales

Si prefieres ejecutar los scripts por separado, sigue este orden:

### 1. Agregar Campos de Tags y Asignación

```sql
-- Ejecutar: scripts/sql/add_tags_and_assignment.sql
```

Este script agrega los campos `tags` y `assigned_to` a las tablas de consultas y contactos.

### 2. Crear Tabla de Auditoría

```sql
-- Ejecutar: scripts/sql/create_audit_logs_table.sql
```

Este script crea la tabla `audit_logs` para registrar todas las acciones del sistema.

### 3. Crear Tabla de Plantillas

```sql
-- Ejecutar: scripts/sql/create_property_templates_table.sql
```

Este script crea la tabla `property_templates` para almacenar plantillas de propiedades.

### 4. Crear Tabla de Roles

```sql
-- Ejecutar: scripts/sql/create_user_roles_table.sql
```

Este script crea la tabla `user_roles` para gestionar roles y permisos de usuarios.

## ✅ Verificación Post-Ejecución

Después de ejecutar los scripts, verifica que todo se creó correctamente:

### Verificar Tablas Creadas

En el SQL Editor, ejecuta:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'audit_logs', 
  'property_templates', 
  'user_roles'
);
```

Deberías ver las 3 tablas listadas.

### Verificar Campos Agregados

```sql
-- Verificar campos en property_inquiries
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'property_inquiries' 
AND column_name IN ('tags', 'assigned_to');

-- Verificar campos en contact_inquiries
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_inquiries' 
AND column_name IN ('tags', 'assigned_to');
```

### Verificar Índices

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('audit_logs', 'property_templates', 'user_roles', 'property_inquiries', 'contact_inquiries');
```

## 🔐 Configurar Rol de Administrador

Después de crear las tablas, necesitas crear un rol de administrador para tu usuario.

### Opción 1: Usar Script Automático (Recomendado)

1. Abre el archivo `scripts/sql/create_first_admin.sql`
2. Reemplaza `'TU_EMAIL_AQUI'` con tu email de usuario
3. Copia y ejecuta el script en el SQL Editor de Supabase

### Opción 2: Crear Manualmente

#### Paso 1: Obtener tu User ID

En el SQL Editor, ejecuta:

```sql
SELECT id, email 
FROM auth.users 
WHERE email = 'tu-email@ejemplo.com';
```

Copia el `id` del usuario.

#### Paso 2: Crear Rol de Administrador

Reemplaza `'TU_USER_ID_AQUI'` con el ID que copiaste:

```sql
INSERT INTO user_roles (user_id, role, permissions, is_active)
VALUES (
  'TU_USER_ID_AQUI',
  'admin',
  '{
    "properties": {"read": true, "create": true, "update": true, "delete": true},
    "inquiries": {"read": true, "create": true, "update": true, "delete": true},
    "contacts": {"read": true, "create": true, "update": true, "delete": true},
    "analytics": {"read": true},
    "users": {"read": true, "create": true, "update": true, "delete": true},
    "settings": {"read": true, "update": true}
  }'::jsonb,
  true
);
```

### Verificar que el Rol se Creó Correctamente

```sql
SELECT ur.*, au.email 
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

## ⚠️ Solución de Problemas

### Error: "function update_updated_at_column() does not exist"

Si obtienes este error, primero ejecuta este script para crear la función:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Error: "relation already exists"

Si una tabla ya existe, el script usa `CREATE TABLE IF NOT EXISTS`, así que debería funcionar. Si persiste el error, puedes eliminar la tabla primero:

```sql
DROP TABLE IF EXISTS nombre_tabla CASCADE;
```

Luego vuelve a ejecutar el script.

### Error de Permisos RLS

Si tienes problemas con las políticas RLS, puedes deshabilitarlas temporalmente:

```sql
ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
```

Luego vuelve a habilitarlas y recrea las políticas.

## 📝 Notas Importantes

1. **Backup**: Siempre haz un backup de tu base de datos antes de ejecutar scripts SQL
2. **Orden de Ejecución**: Si ejecutas scripts individuales, respeta el orden indicado
3. **Dependencias**: Algunas tablas referencian `auth.users`, asegúrate de que exista
4. **Permisos**: Los scripts crean políticas RLS que requieren autenticación

## 🎉 Siguiente Paso

Una vez ejecutados los scripts exitosamente:

1. Verifica que puedes acceder al panel admin
2. Prueba crear una etiqueta en una consulta
3. Prueba asignar un usuario a una consulta
4. Verifica que los logs se están registrando en `/admin/logs`

## 📞 Soporte

Si encuentras algún problema, revisa los logs de Supabase o consulta la documentación oficial de Supabase.
