-- Tabla para almacenar roles y permisos de usuarios
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
