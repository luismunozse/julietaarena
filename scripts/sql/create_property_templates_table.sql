-- Tabla para almacenar plantillas de propiedades
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
