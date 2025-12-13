# 📧 Configuración de EmailJS

Este documento explica cómo configurar EmailJS para que todos los formularios del sitio web funcionen correctamente.

## 📋 Índice

1. [Crear cuenta en EmailJS](#1-crear-cuenta-en-emailjs)
2. [Configurar servicio de email](#2-configurar-servicio-de-email)
3. [Crear plantillas](#3-crear-plantillas)
4. [Configurar variables de entorno](#4-configurar-variables-de-entorno)
5. [Probar formularios](#5-probar-formularios)

---

## 1. Crear cuenta en EmailJS

1. Visita [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en **"Sign Up"**
3. Crea una cuenta gratuita (incluye 200 emails/mes)
4. Verifica tu email

---

## 2. Configurar servicio de email

1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor (Gmail recomendado):
   - **Gmail:** Conecta con tu cuenta de Gmail
   - **Outlook:** Si usas Outlook/Hotmail
   - **Custom SMTP:** Para otros proveedores

### Para Gmail:
- Haz clic en "Connect Account"
- Autoriza la aplicación
- Copia el **Service ID** (lo necesitarás después)

---

## 3. Crear plantillas

### Plantilla 1: Contacto General

**Nombre:** `template_contact`

**Subject:**
```
Nueva consulta de {{from_name}} desde el sitio web
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2c5f7d;">Nueva Consulta desde el Sitio Web</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Nombre:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #2c5f7d;">Mensaje:</h3>
    <p style="white-space: pre-wrap;">{{message}}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="color: #888; font-size: 12px;">
    Este mensaje fue enviado desde el formulario de contacto de julietaarena.com.ar
  </p>
</div>
```

**Valores a configurar:**
- `{{from_name}}` - Variable
- `{{from_email}}` - Variable
- `{{phone}}` - Variable
- `{{message}}` - Variable
- `{{to_name}}` - Variable (Julieta Arena)

---

### Plantilla 2: Vender Propiedad

**Nombre:** `template_vender`

**Subject:**
```
🏠 Nueva solicitud para vender propiedad de {{from_name}}
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2c5f7d;">🏠 Nueva Solicitud de Venta</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Datos del Propietario</h3>
    <p><strong>Nombre:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
    <p><strong>Localidad:</strong> {{locality}}</p>
  </div>
  
  <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Datos de la Propiedad</h3>
    <p><strong>Tipo de Propiedad:</strong> {{property_type}}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #2c5f7d;">Comentarios Adicionales:</h3>
    <p style="white-space: pre-wrap;">{{comments}}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="color: #888; font-size: 12px;">
    Este mensaje fue enviado desde el formulario "Vendé tu Propiedad" de julietaarena.com.ar
  </p>
</div>
```

**Valores a configurar:**
- `{{from_name}}`
- `{{from_email}}`
- `{{phone}}`
- `{{locality}}`
- `{{property_type}}`
- `{{comments}}`

---

### Plantilla 3: Agendar Visita

**Nombre:** `template_appointment`

**Subject:**
```
📅 Nueva visita agendada: {{property_title}}
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2c5f7d;">📅 Nueva Visita Agendada</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Datos del Cliente</h3>
    <p><strong>Nombre:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
  </div>
  
  <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Detalles de la Propiedad</h3>
    <p><strong>Propiedad:</strong> {{property_title}}</p>
    <p><strong>ID:</strong> {{property_id}}</p>
  </div>
  
  <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
    <h3 style="color: #856404; margin-top: 0;">📍 Cita Programada</h3>
    <p style="font-size: 18px;"><strong>Fecha:</strong> {{date}}</p>
    <p style="font-size: 18px;"><strong>Hora:</strong> {{time}}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #2c5f7d;">Comentarios del Cliente:</h3>
    <p style="white-space: pre-wrap;">{{comments}}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="color: #888; font-size: 12px;">
    Este mensaje fue enviado desde el sistema de agendamiento de julietaarena.com.ar
  </p>
</div>
```

**Valores a configurar:**
- `{{from_name}}`
- `{{from_email}}`
- `{{phone}}`
- `{{property_title}}`
- `{{property_id}}`
- `{{date}}`
- `{{time}}`
- `{{comments}}`

---

### Plantilla 4: Consulta de Propiedad

**Nombre:** `template_property_inquiry`

**Subject:**
```
💬 Consulta sobre: {{property_title}}
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2c5f7d;">💬 Nueva Consulta sobre Propiedad</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Datos del Interesado</h3>
    <p><strong>Nombre:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
  </div>
  
  <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2c5f7d; margin-top: 0;">Propiedad de Interés</h3>
    <p><strong>Título:</strong> {{property_title}}</p>
    <p><strong>ID:</strong> {{property_id}}</p>
    <p><strong>Precio:</strong> {{property_price}}</p>
    <p><strong>Ubicación:</strong> {{property_location}}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #2c5f7d;">Consulta:</h3>
    <p style="white-space: pre-wrap;">{{message}}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="color: #888; font-size: 12px;">
    Este mensaje fue enviado desde la ficha de propiedad en julietaarena.com.ar
  </p>
</div>
```

**Valores a configurar:**
- `{{from_name}}`
- `{{from_email}}`
- `{{phone}}`
- `{{property_title}}`
- `{{property_id}}`
- `{{property_price}}`
- `{{property_location}}`
- `{{message}}`

---

## 4. Configurar variables de entorno

1. Copia el archivo `env.example` a `.env.local`:
```bash
cp env.example .env.local
```

2. Completa las variables:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx

# EmailJS Templates IDs
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_VENDER=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_APPOINTMENT=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_PROPERTY=template_xxxxxxx
```

### Dónde encontrar cada valor:

**Service ID:**
- EmailJS Dashboard > Email Services > [Tu servicio] > Service ID

**Public Key:**
- EmailJS Dashboard > Account > API Keys > Public Key

**Template IDs:**
- EmailJS Dashboard > Email Templates > [Tu plantilla] > Template ID

---

## 5. Probar formularios

### Formularios disponibles:

1. **Contacto General** → `/` (scroll hasta sección Contacto)
2. **Vender Propiedad** → `/vender`
3. **Agendar Visita** → Click en "📅 Agendar Visita" en cualquier propiedad
4. **Consulta de Propiedad** → Click en "📞 Consultar" en cualquier propiedad

### Pasos para probar:

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre cada formulario
3. Completa con datos de prueba
4. Envía el formulario
5. Verifica que:
   - Aparezca el toast de éxito
   - Llegue el email a tu bandeja de entrada
   - Los datos se vean correctamente en el email

### Troubleshooting

**Error: "EmailJS no está configurado correctamente"**
- Verifica que todas las variables de entorno estén en `.env.local`
- Reinicia el servidor de desarrollo

**No llegan los emails:**
- Verifica que el Service esté conectado en EmailJS
- Revisa la cuota mensual (200 emails/mes en plan gratuito)
- Chequea la carpeta de spam

**Errores en consola:**
- Abre DevTools (F12) → Console
- Busca mensajes de error de EmailJS
- Verifica que los Template IDs sean correctos

---

## 📊 Límites del Plan Gratuito

- **Emails por mes:** 200
- **Servicios de email:** 2
- **Plantillas:** Ilimitadas
- **Requests:** Sin límite

### Si necesitas más emails:

**Plan Personal ($15/mes):**
- 1,000 emails/mes
- 5 servicios
- Sin límite de plantillas
- Soporte prioritario

**Plan Pro ($25/mes):**
- 2,500 emails/mes
- 10 servicios
- Auto-respuestas
- Webhooks

---

## 🔒 Seguridad

### Buenas prácticas:

✅ **Usa variables de entorno** - No pongas las keys en el código
✅ **Restringe el dominio** - En EmailJS, configura el dominio permitido
✅ **Monitorea el uso** - Revisa el dashboard regularmente
✅ **Rota las keys** - Si se exponen, regeneralas inmediatamente

### Configurar restricción de dominio:

1. EmailJS Dashboard > Account > Security
2. Add Allowed Origins
3. Agrega: `https://julietaarena.com.ar`
4. Save

Esto previene que otros sitios usen tu servicio.

---

## 📝 Notas adicionales

### Personalización de templates

Puedes personalizar:
- Colores del header (#2c5f7d)
- Logo (agrega `<img>` tag)
- Footer con redes sociales
- Auto-respuestas al cliente

### Respuestas automáticas

Para enviar confirmación al cliente:
1. Crea una nueva plantilla de respuesta
2. En tu template actual, activa "Auto-Reply"
3. Selecciona la nueva plantilla
4. Configura para enviar a `{{from_email}}`

---

**¿Problemas o dudas?**

- 📧 Soporte EmailJS: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- 💬 Comunidad: [https://www.emailjs.com/community/](https://www.emailjs.com/community/)

---

**Fecha de creación:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Versión:** 1.0.0

