# Guía de Configuración de Notificaciones por Email

Esta guía te ayudará a configurar el sistema de notificaciones automáticas por email usando Supabase Edge Functions y Resend.

## 📋 Requisitos Previos

- Cuenta en Supabase (ya la tienes)
- Cuenta en Resend (gratis hasta 3000 emails/mes)
- Supabase CLI instalado (opcional, pero recomendado)

---

## 🚀 Paso 1: Crear Cuenta en Resend

1. **Ir a Resend:**
   - Ve a: https://resend.com/signup
   - Regístrate con tu email

2. **Verificar tu dominio (IMPORTANTE):**

   **Opción A: Usar tu dominio personalizado (Recomendado para producción)**
   - Ve a: https://resend.com/domains
   - Click en "Add Domain"
   - Ingresa: `julietaarena.com.ar`
   - Agrega los registros DNS que te proporciona Resend:
     ```
     Tipo: TXT
     Nombre: @ o apex
     Valor: (proporcionado por Resend)

     Tipo: CNAME
     Nombre: resend._domainkey
     Valor: (proporcionado por Resend)
     ```
   - Espera a que se verifique (puede tardar hasta 48 horas, pero usualmente es rápido)

   **Opción B: Usar dominio de prueba (Para desarrollo)**
   - Resend te da un dominio de prueba automático
   - Los emails solo llegarán a emails que agregues como "verified"
   - Ve a: https://resend.com/settings/emails
   - Agrega tu email: `inmobiliaria72juliarena@gmail.com`

3. **Obtener API Key:**
   - Ve a: https://resend.com/api-keys
   - Click en "Create API Key"
   - Nombre: `Julieta Arena Notificaciones`
   - Permisos: `Sending access`
   - **Copia la API Key** (solo se muestra una vez)
   - Guárdala en un lugar seguro

---

## 🔧 Paso 2: Instalar Supabase CLI (Opcional pero Recomendado)

### En Windows:
```powershell
# Usando Scoop
scoop install supabase

# O usando npm
npm install -g supabase
```

### En Linux/Mac:
```bash
# Usando Homebrew
brew install supabase/tap/supabase

# O usando npm
npm install -g supabase
```

### Verificar instalación:
```bash
supabase --version
```

---

## 📤 Paso 3: Desplegar la Edge Function

### Opción A: Usando Supabase CLI (Recomendado)

1. **Login en Supabase CLI:**
   ```bash
   supabase login
   ```

2. **Link con tu proyecto:**
   ```bash
   cd /ruta/a/julietaarena
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   *Nota: Encuentra tu PROJECT_REF en el Dashboard de Supabase → Settings → General*

3. **Configurar variables de entorno:**
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
   supabase secrets set ADMIN_EMAIL=inmobiliaria72juliarena@gmail.com
   ```

4. **Desplegar la función:**
   ```bash
   supabase functions deploy send-inquiry-notification
   ```

5. **Verificar despliegue:**
   ```bash
   supabase functions list
   ```

### Opción B: Usando el Dashboard de Supabase

1. **Ir a Edge Functions:**
   - Ve a: Dashboard de Supabase → Edge Functions
   - Click en "Create new function"
   - Nombre: `send-inquiry-notification`

2. **Copiar el código:**
   - Abre el archivo: `supabase/functions/send-inquiry-notification/index.ts`
   - Copia todo el contenido
   - Pégalo en el editor del Dashboard

3. **Configurar variables de entorno:**
   - En el Dashboard, ve a: Settings → Edge Functions → Secrets
   - Agrega:
     - `RESEND_API_KEY`: Tu API key de Resend
     - `ADMIN_EMAIL`: `inmobiliaria72juliarena@gmail.com`

4. **Desplegar:**
   - Click en "Deploy"

---

## 🗄️ Paso 4: Configurar Triggers en la Base de Datos

1. **Habilitar extensión pg_net:**
   - Ve a: Dashboard de Supabase → Database → Extensions
   - Busca `pg_net`
   - Click en "Enable"

2. **Obtener tu información de Supabase:**
   - **Project URL**: Dashboard → Settings → API → Project URL
   - **Anon Key**: Dashboard → Settings → API → Project API keys → anon/public

3. **Editar el script SQL:**
   - Abre: `SETUP_EMAIL_NOTIFICATIONS.sql`
   - Reemplaza:
     - `YOUR_PROJECT_REF` con tu Project Ref
     - `YOUR_SUPABASE_ANON_KEY` con tu Anon Key

4. **Ejecutar el script:**
   - Ve a: Dashboard de Supabase → SQL Editor
   - Click en "New Query"
   - Pega el contenido de `SETUP_EMAIL_NOTIFICATIONS.sql` (editado)
   - Click en "Run"

---

## ✅ Paso 5: Probar el Sistema

### Prueba Manual:

1. **Probar consulta de propiedad:**
   - Ve a: `http://localhost:3000/propiedades/[id]`
   - Llena el formulario de contacto
   - Envíalo
   - Revisa tu email

2. **Probar contacto general:**
   - Ve a: `http://localhost:3000/#contacto`
   - Llena el formulario de contacto
   - Envíalo
   - Revisa tu email

### Revisar Logs:

1. **Logs de Edge Function:**
   ```bash
   supabase functions logs send-inquiry-notification
   ```

   O en el Dashboard: Edge Functions → send-inquiry-notification → Logs

2. **Logs de Resend:**
   - Ve a: https://resend.com/emails
   - Verás todos los emails enviados

---

## 🔍 Troubleshooting

### No recibo emails

**1. Verifica Resend:**
- Ve a https://resend.com/emails
- ¿Aparece el email en la lista?
- ¿Está en estado "delivered"?

**2. Verifica configuración:**
```bash
# Ver secrets configurados
supabase secrets list
```

**3. Revisa logs:**
```bash
supabase functions logs send-inquiry-notification --tail
```

**4. Revisa spam:**
- Los primeros emails pueden ir a spam
- Marca como "No es spam"

### Edge Function falla

**1. Verifica que esté desplegada:**
```bash
supabase functions list
```

**2. Revisa permisos de pg_net:**
```sql
-- Ejecuta en SQL Editor
SELECT * FROM pg_extension WHERE extname = 'pg_net';
```

**3. Verifica URL en los triggers:**
```sql
-- Ver la función
SELECT prosrc FROM pg_proc WHERE proname = 'notify_property_inquiry';
```

### Emails van a spam

**1. Configura SPF, DKIM y DMARC:**
- En tu proveedor de DNS, agrega los registros que Resend te proporcionó
- Esto mejora la reputación del dominio

**2. Calienta el dominio:**
- Los primeros días, envía emails en menor volumen
- La reputación mejora con el tiempo

---

## 📊 Monitoreo

### Dashboard de Resend:
- **Emails enviados**: https://resend.com/emails
- **API Key usage**: https://resend.com/api-keys
- **Dominio status**: https://resend.com/domains

### Supabase Dashboard:
- **Edge Function logs**: Dashboard → Edge Functions → Logs
- **Database logs**: Dashboard → Database → Logs

---

## 💰 Límites y Costos

### Resend (Plan Gratuito):
- ✅ 3,000 emails/mes gratis
- ✅ 100 emails/día
- ✅ Soporte por email

### Supabase (Plan Gratuito):
- ✅ 500,000 Edge Function invocations/mes
- ✅ Suficiente para el volumen esperado

---

## 🔒 Seguridad

1. **Nunca compartas tu RESEND_API_KEY públicamente**
2. **No la agregues al código fuente**
3. **Usa variables de entorno de Supabase**
4. **Rota la key cada 6 meses**

---

## 📞 Soporte

- **Resend Docs**: https://resend.com/docs
- **Supabase Docs**: https://supabase.com/docs/guides/functions
- **Supabase Discord**: https://discord.supabase.com
