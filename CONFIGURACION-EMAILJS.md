# Configuración de EmailJS para el Formulario de Contacto

## Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita (200 emails/mes)
3. Verifica tu email

### 2. Configurar Gmail como servicio

#### Opción A: Gmail con Contraseña de Aplicación (RECOMENDADO)

**Paso 1: Habilitar verificación en 2 pasos**
1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Selecciona **Seguridad**
3. Activa **Verificación en 2 pasos** (si no está activada)

**Paso 2: Generar contraseña de aplicación**
1. En **Seguridad**, busca **Contraseñas de aplicaciones**
2. Selecciona **Correo** y **Otro (nombre personalizado)**
3. Escribe "EmailJS" como nombre
4. **Copia la contraseña generada** (16 caracteres)

**Paso 3: Configurar en EmailJS**
1. En el dashboard de EmailJS, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona **Gmail**
4. Usa estas credenciales:
   - **Email**: inmobiliaria72juliarena@gmail.com
   - **Password**: [la contraseña de aplicación generada]
5. Haz clic en **Create Service**
6. **Copia el Service ID**

#### Opción B: Gmail con OAuth (Alternativa)
Si la opción A no funciona:
1. Selecciona **Gmail** en EmailJS
2. Usa **OAuth2** en lugar de contraseña
3. Autoriza los permisos necesarios
4. Asegúrate de que la cuenta tenga **"Acceso a aplicaciones menos seguras"** habilitado

### 3. Crear template de email
1. Ve a **Email Templates**
2. Haz clic en **Create New tu_public_key_aquiTemplate**
3. Configura el template con estos campos:

**Subject (Asunto):**
```
Nuevo mensaje de contacto - {{from_name}}
```

**Content (Contenido):**
```
Hola Julieta,

Has recibido un nuevo mensaje de contacto desde tu sitio web:

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}
Servicio de interés: {{service}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde tu sitio web inmobiliario.
```

4. **Copia el Template ID** (lo necesitarás después)

### 4. Obtener Public Key
1. Ve a **Account** → **General**
2. **Copia tu Public Key**

### 5. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id_aqui
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

**Reemplaza los valores:**
- `tu_service_id_aqui` → Service ID del paso 2
- `tu_template_id_aqui` → Template ID del paso 3
- `tu_public_key_aqui` → Public Key del paso 4

### 6. Reiniciar el servidor de desarrollo
```bash
npm run dev
```

## Prueba del formulario

1. Ve a tu sitio web local
2. Llena el formulario de contacto
3. Envía el mensaje
4. Verifica que recibas el email en inmobiliaria72juliarena@gmail.com

## Solución de problemas

### Error 412: "Gmail_API la solicitud tenía alcances de autenticación insuficientes"
**Solución:**
1. **Usa contraseña de aplicación** (no tu contraseña normal de Gmail)
2. **Habilita verificación en 2 pasos** en tu cuenta de Google
3. **Genera una contraseña específica** para EmailJS
4. **No uses OAuth** inicialmente, usa autenticación con contraseña

**Pasos detallados:**
1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad** → **Verificación en 2 pasos** (actívala si no está)
3. **Seguridad** → **Contraseñas de aplicaciones**
4. Genera una nueva contraseña para "EmailJS"
5. Usa esa contraseña (no tu contraseña normal) en EmailJS

### Error: "EmailJS no está configurado correctamente"
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### No se reciben emails
- Verifica que el Service ID y Template ID sean correctos
- Revisa la carpeta de spam en Gmail
- Verifica que la cuenta de Gmail esté conectada correctamente en EmailJS
- **Asegúrate de usar contraseña de aplicación, no tu contraseña normal**

### Error de autenticación con Gmail
- **NO uses tu contraseña normal de Gmail**
- **SÍ usa la contraseña de aplicación generada**
- Verifica que la verificación en 2 pasos esté activada
- Si persiste, prueba con una cuenta de Gmail diferente

### Error de CORS
- EmailJS maneja esto automáticamente, pero si persiste, verifica que el dominio esté autorizado en EmailJS

## Límites del plan gratuito

- **200 emails por mes**
- **1 servicio de email**
- **2 templates**
- **2 usuarios**

Para más información, visita: [EmailJS Documentation](https://www.emailjs.com/docs/)
