-- Tabla para almacenar logs de auditoría
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

