-- Script para agregar campos de tags y asignación a las tablas de consultas

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
