-- Tabla para almacenar consultas generales de contacto
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Información del cliente
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,

  -- Información de la consulta
  service VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,

  -- Estado y gestión
  status VARCHAR(50) DEFAULT 'nueva' CHECK (status IN ('nueva', 'leida', 'contactada', 'cerrada')),
  notes TEXT,

  -- Índices para búsquedas rápidas
  CONSTRAINT contact_inquiries_id_key UNIQUE (id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_customer_email ON contact_inquiries(customer_email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_service ON contact_inquiries(service);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserción pública de consultas
CREATE POLICY "Permitir inserción pública de consultas de contacto"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden leer consultas
CREATE POLICY "Solo usuarios autenticados pueden leer consultas de contacto"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden actualizar consultas
CREATE POLICY "Solo usuarios autenticados pueden actualizar consultas de contacto"
  ON contact_inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar consultas
CREATE POLICY "Solo usuarios autenticados pueden eliminar consultas de contacto"
  ON contact_inquiries
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentarios para documentación
COMMENT ON TABLE contact_inquiries IS 'Almacena las consultas generales de contacto del sitio web';
COMMENT ON COLUMN contact_inquiries.service IS 'Servicio de interés: venta, alquiler, remate, jubilacion, tasacion, asesoria, otro';
COMMENT ON COLUMN contact_inquiries.status IS 'Estado de la consulta: nueva, leida, contactada, cerrada';
COMMENT ON COLUMN contact_inquiries.notes IS 'Notas internas del administrador sobre esta consulta';
