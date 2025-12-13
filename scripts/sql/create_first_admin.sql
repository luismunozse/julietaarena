-- =====================================================
-- Script: Crear Primer Administrador
-- =====================================================
-- Este script crea un rol de administrador para un usuario existente
-- IMPORTANTE: Reemplaza 'TU_EMAIL_AQUI' con tu email antes de ejecutar
-- =====================================================

-- Paso 1: Obtener el User ID del email (reemplaza con tu email)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Obtener el ID del usuario por email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'TU_EMAIL_AQUI'; -- ⚠️ REEMPLAZA ESTO CON TU EMAIL
  
  -- Si el usuario existe, crear el rol de administrador
  IF v_user_id IS NOT NULL THEN
    -- Insertar rol de administrador con permisos completos
    INSERT INTO user_roles (user_id, role, permissions, is_active)
    VALUES (
      v_user_id,
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
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      role = 'admin',
      permissions = '{
        "properties": {"read": true, "create": true, "update": true, "delete": true},
        "inquiries": {"read": true, "create": true, "update": true, "delete": true},
        "contacts": {"read": true, "create": true, "update": true, "delete": true},
        "analytics": {"read": true},
        "users": {"read": true, "create": true, "update": true, "delete": true},
        "settings": {"read": true, "update": true}
      }'::jsonb,
      is_active = true;
    
    RAISE NOTICE 'Rol de administrador creado para el usuario: %', v_user_id;
  ELSE
    RAISE EXCEPTION 'Usuario no encontrado. Verifica que el email sea correcto y que el usuario exista en auth.users';
  END IF;
END $$;

-- =====================================================
-- Alternativa: Si conoces el User ID directamente
-- =====================================================
-- Descomenta y reemplaza 'TU_USER_ID_AQUI' con el UUID del usuario
/*
INSERT INTO user_roles (user_id, role, permissions, is_active)
VALUES (
  'TU_USER_ID_AQUI'::uuid, -- ⚠️ REEMPLAZA ESTO CON TU USER ID
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
)
ON CONFLICT (user_id) DO UPDATE
SET 
  role = 'admin',
  permissions = '{
    "properties": {"read": true, "create": true, "update": true, "delete": true},
    "inquiries": {"read": true, "create": true, "update": true, "delete": true},
    "contacts": {"read": true, "create": true, "update": true, "delete": true},
    "analytics": {"read": true},
    "users": {"read": true, "create": true, "update": true, "delete": true},
    "settings": {"read": true, "update": true}
  }'::jsonb,
  is_active = true;
*/
