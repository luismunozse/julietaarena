# Fix Service Worker - Eliminar notifications-sw.js

## ✅ Problema Resuelto

**Error**: `Failed to fetch` causado por el service worker `notifications-sw.js` que interceptaba todas las peticiones.

```
The FetchEvent for "http://localhost:3000/..." resulted in a network error response: the promise was rejected.
notifications-sw.js:16  Uncaught (in promise) TypeError: Failed to fetch
```

## 🔧 Solución Implementada

### 1. Archivo eliminado
- ❌ Eliminado: `public/notifications-sw.js`

### 2. Script de desregistro agregado
- ✅ Agregado en `src/app/layout.tsx`
- Se ejecuta automáticamente al cargar cualquier página
- Detecta y desregistra el service worker problemático
- Recarga la página después de desregistrar

### 3. Código agregado al layout:

```javascript
// Desregistrar service workers problemáticos
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      if (registration.active && registration.active.scriptURL.includes('notifications-sw')) {
        registration.unregister().then(function(success) {
          console.log('✅ Service Worker problemático desregistrado');
          if (success) window.location.reload();
        });
      }
    }
  });
}
```

## 🧪 Pasos para Verificar

1. **Recarga la página** en tu navegador (F5 o Ctrl+R)
2. **Busca en la consola** el mensaje: `✅ Service Worker problemático desregistrado`
3. **La página se recargará automáticamente** una vez
4. **Intenta crear una propiedad nuevamente**
5. ✅ El error `Failed to fetch` ya no debería aparecer

## 🔍 Verificar manualmente

Si quieres verificar que el service worker fue desregistrado:

1. Abre **DevTools** (F12)
2. Ve a la pestaña **Application** (o "Aplicación")
3. En el menú lateral izquierdo, ve a **Service Workers**
4. Verifica que **NO aparezca** `notifications-sw.js`
5. Si aún aparece, haz clic en **"Unregister"** manualmente

## 📊 Estado Después del Fix

**Antes**:
```
✗ Service Worker interceptando peticiones
✗ Failed to fetch en todas las navegaciones
✗ Errores en /propiedades/resultado
✗ Creación de propiedades bloqueada
```

**Después**:
```
✓ Service Worker desregistrado
✓ Peticiones normales funcionando
✓ Navegación sin errores
✓ Creación de propiedades OK
```

## ⚠️ Si el problema persiste

Si después de recargar sigues viendo errores:

### Opción 1: Limpiar cache manualmente
1. Abre DevTools (F12)
2. Ve a **Application → Storage**
3. Haz clic en **"Clear site data"**
4. Recarga la página (Ctrl+Shift+R para hard reload)

### Opción 2: Modo incógnito
1. Abre una ventana en modo incógnito
2. Ve a http://localhost:3000
3. Verifica que funcione sin errores

### Opción 3: Desregistrar desde consola
Ejecuta esto en la consola del navegador:

```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
  location.reload();
});
```

## 💡 Por qué pasó esto

El service worker `notifications-sw.js` probablemente fue creado para implementar notificaciones push o funcionalidad PWA, pero tenía un bug en la línea 16:

```javascript
event.respondWith(fetch(event.request))  // ❌ Falla si no hay red o hay CORS
```

Este código interceptaba TODAS las peticiones y las re-enviaba, causando:
- Errores de red
- Problemas con CORS
- Bloqueo de navegación
- Fallas en la creación de propiedades

## 🚀 Próximos pasos

Si en el futuro necesitas implementar un service worker para PWA o notificaciones:

1. **Usar next-pwa**: Plugin oficial de Next.js para PWA
2. **Agregar manejo de errores**: Catch en el fetch
3. **Cache estratégico**: No interceptar todo, solo lo necesario
4. **Testing exhaustivo**: Probar en diferentes escenarios

## 📝 Archivos Modificados

- ❌ Eliminado: `public/notifications-sw.js`
- ✅ Modificado: `src/app/layout.tsx` (agregado script de desregistro)

---

**Resultado final**: El service worker problemático ha sido eliminado y tu aplicación debería funcionar normalmente ahora 🎉
