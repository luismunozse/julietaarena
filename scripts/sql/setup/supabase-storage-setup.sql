-- =====================================================
-- JULIETA ARENA - CONFIGURACIÓN DE STORAGE
-- =====================================================
-- Este script configura las políticas de seguridad para el storage bucket
--
-- PASOS PREVIOS (hacer en Supabase Dashboard):
-- 1. Ir a Storage > Create a new bucket
-- 2. Nombre del bucket: "property-images"
-- 3. Public bucket: SÍ (marcar checkbox)
-- 4. Hacer clic en "Create bucket"
--
-- Después de crear el bucket, ejecutar este SQL:
-- =====================================================

-- 1. POLÍTICAS PARA EL BUCKET 'property-images'
-- =====================================================

-- Permitir que todos puedan VER las imágenes (lectura pública)
DROP POLICY IF EXISTS "Imágenes públicas para lectura" ON storage.objects;
CREATE POLICY "Imágenes públicas para lectura"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Permitir que usuarios autenticados puedan SUBIR imágenes
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- Permitir que usuarios autenticados puedan ACTUALIZAR sus imágenes
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar imágenes" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images');

-- Permitir que usuarios autenticados puedan ELIMINAR sus imágenes
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar imágenes" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- IMPORTANTE:
-- - El bucket debe ser PÚBLICO para que las imágenes se puedan ver sin autenticación
-- - Las URLs de las imágenes serán:
--   https://[PROJECT_ID].supabase.co/storage/v1/object/public/property-images/[filename]
--
-- EJEMPLO DE USO:
-- 1. Subir imagen desde JavaScript:
--    const { data, error } = await supabase.storage
--      .from('property-images')
--      .upload('property-1-1.jpg', file)
--
-- 2. Obtener URL pública:
--    const { data } = supabase.storage
--      .from('property-images')
--      .getPublicUrl('property-1-1.jpg')
--    console.log(data.publicUrl)
