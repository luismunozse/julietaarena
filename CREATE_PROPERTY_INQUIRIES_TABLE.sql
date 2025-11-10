-- Tabla para almacenar consultas sobre propiedades
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Información de la propiedad
  property_id VARCHAR(255) NOT NULL,
  property_title TEXT NOT NULL,
  property_price VARCHAR(100),
  property_location VARCHAR(255),

  -- Información del cliente
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  message TEXT,

  -- Estado y gestión
  status VARCHAR(50) DEFAULT 'nueva' CHECK (status IN ('nueva', 'leida', 'contactada', 'cerrada')),
  notes TEXT,

  -- Índices para búsquedas rápidas
  CONSTRAINT property_inquiries_property_id_key UNIQUE (id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_property_inquiries_property_id ON property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_status ON property_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_created_at ON property_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_customer_email ON property_inquiries(customer_email);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_inquiries_updated_at
  BEFORE UPDATE ON property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden insertar consultas
CREATE POLICY "Permitir inserción pública de consultas"
  ON property_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden leer consultas
CREATE POLICY "Solo usuarios autenticados pueden leer consultas"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden actualizar consultas
CREATE POLICY "Solo usuarios autenticados pueden actualizar consultas"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar consultas
CREATE POLICY "Solo usuarios autenticados pueden eliminar consultas"
  ON property_inquiries
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentarios para documentación
COMMENT ON TABLE property_inquiries IS 'Almacena las consultas de clientes sobre propiedades específicas';
COMMENT ON COLUMN property_inquiries.status IS 'Estado de la consulta: nueva, leida, contactada, cerrada';
COMMENT ON COLUMN property_inquiries.notes IS 'Notas internas del administrador sobre esta consulta';
