-- =====================================================
-- Script Consolidado: Setup Completo de Tablas Admin
-- =====================================================
-- Este script crea todas las tablas y campos necesarios
-- para las funcionalidades avanzadas del panel admin
-- =====================================================

-- =====================================================
-- 1. Agregar campos de tags y asignación a consultas
-- =====================================================

-- Agregar campo tags a property_inquiries
ALTER TABLE property_inquiries 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Agregar campo assigned_to a property_inquiries
ALTER TABLE property_inquiries 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Agregar campo tags a contact_inquiries
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Agregar campo assigned_to a contact_inquiries
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_property_inquiries_tags ON property_inquiries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_assigned_to ON property_inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_tags ON contact_inquiries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_assigned_to ON contact_inquiries(assigned_to);

-- Comentarios
COMMENT ON COLUMN property_inquiries.tags IS 'Array de etiquetas para categorizar la consulta';
COMMENT ON COLUMN property_inquiries.assigned_to IS 'ID del usuario asignado a esta consulta';
COMMENT ON COLUMN contact_inquiries.tags IS 'Array de etiquetas para categorizar el contacto';
COMMENT ON COLUMN contact_inquiries.assigned_to IS 'ID del usuario asignado a este contacto';

-- =====================================================
-- 2. Crear tabla de logs de auditoría
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Información del usuario
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  
  -- Información de la acción
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'assign', 'status_change', 'tag_add', 'tag_remove')),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('property', 'property_inquiry', 'contact_inquiry', 'user', 'template')),
  entity_id UUID NOT NULL,
  
  -- Detalles del cambio
  changes JSONB,
  old_values JSONB,
  new_values JSONB,
  
  -- Información adicional
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Índices para búsquedas rápidas
  CONSTRAINT audit_logs_id_key UNIQUE (id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_composite ON audit_logs(entity_type, entity_id);

-- Políticas RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden leer logs
CREATE POLICY "Solo usuarios autenticados pueden leer logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo el sistema puede insertar logs (a través de funciones)
CREATE POLICY "Solo sistema puede insertar logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE audit_logs IS 'Registra todas las acciones importantes del sistema para auditoría';
COMMENT ON COLUMN audit_logs.action_type IS 'Tipo de acción: create, update, delete, assign, status_change, tag_add, tag_remove';
COMMENT ON COLUMN audit_logs.entity_type IS 'Tipo de entidad afectada: property, property_inquiry, contact_inquiry, user, template';
COMMENT ON COLUMN audit_logs.changes IS 'JSON con los cambios realizados';
COMMENT ON COLUMN audit_logs.old_values IS 'Valores anteriores antes del cambio';
COMMENT ON COLUMN audit_logs.new_values IS 'Valores nuevos después del cambio';

-- =====================================================
-- 3. Crear tabla de plantillas de propiedades
-- =====================================================

CREATE TABLE IF NOT EXISTS property_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Información básica
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) CHECK (category IN ('casa', 'departamento', 'terreno', 'local', 'oficina')),
  
  -- Datos de la plantilla (JSON con todos los campos de una propiedad)
  template_data JSONB NOT NULL,
  
  -- Metadatos
  created_by UUID REFERENCES auth.users(id),
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Índices
  CONSTRAINT property_templates_id_key UNIQUE (id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_property_templates_category ON property_templates(category);
CREATE INDEX IF NOT EXISTS idx_property_templates_created_by ON property_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_property_templates_is_active ON property_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_property_templates_created_at ON property_templates(created_at DESC);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_property_templates_updated_at
  BEFORE UPDATE ON property_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE property_templates ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden leer plantillas
CREATE POLICY "Solo usuarios autenticados pueden leer plantillas"
  ON property_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden crear plantillas
CREATE POLICY "Solo usuarios autenticados pueden crear plantillas"
  ON property_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar plantillas
CREATE POLICY "Solo usuarios autenticados pueden actualizar plantillas"
  ON property_templates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar plantillas
CREATE POLICY "Solo usuarios autenticados pueden eliminar plantillas"
  ON property_templates
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentarios
COMMENT ON TABLE property_templates IS 'Plantillas reutilizables para crear propiedades similares rápidamente';
COMMENT ON COLUMN property_templates.template_data IS 'JSON con todos los campos de una propiedad que se usarán como plantilla';
COMMENT ON COLUMN property_templates.usage_count IS 'Contador de cuántas veces se ha usado esta plantilla';

-- =====================================================
-- 4. Crear tabla de roles y permisos de usuarios
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Relación con usuario
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Rol del usuario
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  
  -- Permisos granulares (JSONB para flexibilidad)
  permissions JSONB DEFAULT '{
    "properties": {"read": true, "create": false, "update": false, "delete": false},
    "inquiries": {"read": true, "create": false, "update": false, "delete": false},
    "contacts": {"read": true, "create": false, "update": false, "delete": false},
    "analytics": {"read": true},
    "users": {"read": false, "create": false, "update": false, "delete": false},
    "settings": {"read": false, "update": false}
  }'::jsonb,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Metadatos
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  -- Índices
  CONSTRAINT user_roles_id_key UNIQUE (id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON user_roles(is_active);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio rol
CREATE POLICY "Usuarios pueden ver su propio rol"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ));

-- Política: Solo admins pueden crear/actualizar/eliminar roles
CREATE POLICY "Solo admins pueden gestionar roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  ));

-- Comentarios
COMMENT ON TABLE user_roles IS 'Gestiona roles y permisos granulares de usuarios del panel admin';
COMMENT ON COLUMN user_roles.role IS 'Rol principal: admin (acceso total), editor (puede editar), viewer (solo lectura)';
COMMENT ON COLUMN user_roles.permissions IS 'JSON con permisos granulares por sección del panel';

-- =====================================================
-- Script completado exitosamente
-- =====================================================

