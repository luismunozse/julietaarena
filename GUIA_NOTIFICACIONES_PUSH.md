# Guía de Notificaciones Push en el Navegador

Las notificaciones push te permiten recibir alertas instantáneas de nuevas consultas directamente en tu escritorio, incluso con la pestaña del navegador minimizada.

---

## 🔔 ¿Cómo activarlas?

### 1. **Ir al Dashboard del Admin**
   - Navega a: `https://julietaarena.com.ar/admin`
   - O en local: `http://localhost:3000/admin`

### 2. **Scroll hacia abajo**
   - Busca la sección "Notificaciones en Tiempo Real"

### 3. **Activar Notificaciones**
   - Click en el botón "🔔 Activar Notificaciones"
   - Tu navegador te preguntará si permites notificaciones
   - Click en "Permitir" o "Allow"

### 4. **¡Listo!**
   - Verás un indicador verde que dice "Notificaciones activas"
   - A partir de ahora recibirás alertas instantáneas

---

## ⚡ ¿Cómo funcionan?

### Cuando llega una nueva consulta:

1. **Consulta de Propiedad:**
   ```
   🏠 Nueva Consulta de Propiedad
   María Rodríguez pregunta sobre Casa en Nueva Córdoba
   ```

2. **Contacto General:**
   ```
   📧 Nuevo Contacto General
   Juan Pérez pregunta sobre Remates Judiciales
   ```

### Características:

- ✅ **Instantáneas**: Recibes la alerta en menos de 1 segundo
- ✅ **Funcionan minimizadas**: No necesitas tener la pestaña abierta
- ✅ **Clickeables**: Haz click para ir directo al panel
- ✅ **Auto-cierre**: Se cierran solas después de 10 segundos
- ✅ **Sonido opcional**: Reproducen un sonido suave (si está disponible)

### Limitaciones:

- ⚠️ **Solo con navegador abierto**: El navegador debe estar ejecutándose
- ⚠️ **No funcionan en modo incógnito**: Por seguridad del navegador
- ⚠️ **Requieren permisos**: Debes dar permiso explícito

---

## 🌐 Navegadores Compatibles

| Navegador | Escritorio | Móvil | Nota |
|---|---|---|---|
| Chrome | ✅ Sí | ✅ Sí | Mejor soporte |
| Firefox | ✅ Sí | ✅ Sí | Funciona bien |
| Edge | ✅ Sí | ✅ Sí | Basado en Chromium |
| Safari | ✅ Sí | ⚠️ Limitado | Requiere macOS/iOS reciente |
| Opera | ✅ Sí | ✅ Sí | Basado en Chromium |

---

## 🛠️ Troubleshooting

### No recibo notificaciones

#### 1. **Verifica que estén activadas:**
- Ve al Dashboard → Scroll abajo
- ¿Ves "Notificaciones activas" con un punto verde?
- Si no, click en "Activar Notificaciones"

#### 2. **Revisa permisos del navegador:**

**Chrome/Edge:**
1. Click en el candado/ícono junto a la URL
2. Click en "Configuración del sitio"
3. Busca "Notificaciones"
4. Asegúrate que esté en "Permitir"

**Firefox:**
1. Click en el candado junto a la URL
2. Click en la flecha junto a "Bloquear"
3. Busca "Notificaciones"
4. Selecciona "Permitir"

**Safari:**
1. Safari → Preferencias → Sitios web
2. Click en "Notificaciones"
3. Busca julietaarena.com.ar
4. Selecciona "Permitir"

#### 3. **Verifica configuración del sistema:**

**Windows 10/11:**
1. Configuración → Sistema → Notificaciones
2. Asegúrate que las notificaciones estén activadas
3. Verifica que tu navegador tenga permiso

**macOS:**
1. Preferencias del Sistema → Notificaciones
2. Busca tu navegador en la lista
3. Asegúrate que las notificaciones estén activadas

#### 4. **Prueba con una consulta de prueba:**
- Abre el sitio en otra pestaña o ventana privada
- Envía una consulta desde el formulario
- Deberías recibir una notificación

#### 5. **Revisa la consola del navegador:**
- Presiona F12
- Ve a la pestaña "Console"
- ¿Ves algún error relacionado con "Notification"?

---

## 🔕 ¿Cómo desactivarlas?

### Temporalmente:

1. Ve al Dashboard → Scroll abajo
2. Click en "🔕 Desactivar"

### Permanentemente:

1. Sigue los pasos de "Revisa permisos del navegador" arriba
2. Cambia de "Permitir" a "Bloquear"

---

## 💡 Tips y Mejores Prácticas

### 1. **Mantén el navegador abierto:**
- No necesitas tener la pestaña visible
- Pero el navegador debe estar ejecutándose
- En Windows/Mac, minimiza en lugar de cerrar

### 2. **Combina con notificaciones por email:**
- Las notificaciones push son instantáneas
- Los emails sirven como respaldo y registro
- Así no te pierdes ninguna consulta

### 3. **Configura el sonido:**
- Si las notificaciones son muy frecuentes
- Puedes silenciar el sonido en la configuración del navegador
- Las notificaciones visuales seguirán funcionando

### 4. **Prueba regularmente:**
- Cada semana, haz una prueba con una consulta de ejemplo
- Así verificas que todo funciona correctamente

---

## 🔐 Privacidad y Seguridad

- ✅ **Sin datos personales**: No guardamos información sensible
- ✅ **Solo en tu dispositivo**: Las notificaciones solo las ves tú
- ✅ **Sin tracking**: No rastreamos tu actividad
- ✅ **Puedes desactivarlas**: En cualquier momento

---

## 📊 Comparación: Email vs Push

| Característica | Email | Push Browser |
|---|---|---|
| **Velocidad** | 1-5 minutos | < 1 segundo |
| **Requiere navegador abierto** | ❌ No | ✅ Sí |
| **Funciona sin internet** | ❌ No | ❌ No |
| **Historial permanente** | ✅ Sí | ❌ No |
| **Clickeable a panel** | ✅ Sí | ✅ Sí |
| **Configuración** | Media | Fácil |

**Recomendación:** Usa ambas para máxima efectividad.

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo recibir notificaciones en mi celular?**
R: Sí, si usas Chrome o Firefox móvil y tienes la pestaña abierta.

**P: ¿Funcionan si cierro la pestaña pero dejo el navegador abierto?**
R: Sí, esa es la ventaja principal.

**P: ¿Puedo personalizar el sonido?**
R: Actualmente no, pero puedes silenciarlas en la configuración del navegador.

**P: ¿Cuántas notificaciones puedo recibir?**
R: Ilimitadas, no hay costo ni límite.

**P: ¿Qué pasa si rechazo el permiso?**
R: Puedes habilitarlo después desde la configuración del navegador.

---

## 📞 Soporte

¿Problemas? Contacta al desarrollador o revisa la documentación del navegador:

- **Chrome**: https://support.google.com/chrome/answer/3220216
- **Firefox**: https://support.mozilla.org/kb/push-notifications-firefox
- **Safari**: https://support.apple.com/guide/safari/manage-website-notifications

---

¡Listo! Ahora nunca te perderás una consulta importante. 🎉
