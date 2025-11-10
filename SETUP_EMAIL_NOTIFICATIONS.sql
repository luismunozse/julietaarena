-- Script SQL para configurar notificaciones por email
-- Este script crea triggers que invocan la Edge Function cuando se inserta una nueva consulta

-- IMPORTANTE: Primero debes desplegar la Edge Function send-inquiry-notification
-- y configurar las variables de entorno en Supabase:
-- - RESEND_API_KEY: Tu API key de Resend
-- - ADMIN_EMAIL: Email donde recibirás las notificaciones

-- ============================================
-- TRIGGER PARA CONSULTAS DE PROPIEDADES
-- ============================================

-- Función que se ejecuta cuando se inserta una consulta de propiedad
CREATE OR REPLACE FUNCTION notify_property_inquiry()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  supabase_anon_key TEXT;
BEGIN
  -- URL de tu proyecto Supabase (reemplaza con tu URL real)
  function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-inquiry-notification';

  -- Anon key de Supabase (reemplaza con tu anon key real)
  supabase_anon_key := 'YOUR_SUPABASE_ANON_KEY';

  -- Llamar a la Edge Function de forma asíncrona usando pg_net
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || supabase_anon_key
      ),
      body := jsonb_build_object(
        'type', 'property_inquiry',
        'record', row_to_json(NEW)
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se inserta una nueva consulta de propiedad
DROP TRIGGER IF EXISTS on_property_inquiry_created ON property_inquiries;
CREATE TRIGGER on_property_inquiry_created
  AFTER INSERT ON property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_inquiry();

-- ============================================
-- TRIGGER PARA CONTACTOS GENERALES
-- ============================================

-- Función que se ejecuta cuando se inserta un contacto general
CREATE OR REPLACE FUNCTION notify_contact_inquiry()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  supabase_anon_key TEXT;
BEGIN
  -- URL de tu proyecto Supabase (reemplaza con tu URL real)
  function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-inquiry-notification';

  -- Anon key de Supabase (reemplaza con tu anon key real)
  supabase_anon_key := 'YOUR_SUPABASE_ANON_KEY';

  -- Llamar a la Edge Function de forma asíncrona usando pg_net
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || supabase_anon_key
      ),
      body := jsonb_build_object(
        'type', 'contact_inquiry',
        'record', row_to_json(NEW)
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se inserta un nuevo contacto
DROP TRIGGER IF EXISTS on_contact_inquiry_created ON contact_inquiries;
CREATE TRIGGER on_contact_inquiry_created
  AFTER INSERT ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_inquiry();

-- ============================================
-- HABILITAR LA EXTENSIÓN pg_net (si no está habilitada)
-- ============================================
-- Ejecuta esto desde el Dashboard de Supabase → Database → Extensions
-- O descomenta la siguiente línea:
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- COMENTARIOS INFORMATIVOS
-- ============================================
COMMENT ON FUNCTION notify_property_inquiry() IS 'Envía notificación por email cuando se crea una consulta de propiedad';
COMMENT ON FUNCTION notify_contact_inquiry() IS 'Envía notificación por email cuando se crea un contacto general';
