# Debug - Guardado Automático del Formulario

## 🔍 Pasos para Verificar el Problema

### Paso 1: Limpiar Caché del Navegador

**MUY IMPORTANTE**: El navegador puede tener el código viejo en caché.

1. Abre DevTools (F12)
2. Haz **clic derecho** en el botón de recargar
3. Selecciona **"Vaciar caché y volver a cargar de manera forzada"** (Empty Cache and Hard Reload)

O simplemente presiona **Ctrl+Shift+R** (Windows/Linux) o **Cmd+Shift+R** (Mac)

### Paso 2: Ir al Formulario

1. Ve a http://localhost:3001/admin/propiedades/nueva
2. Abre la **Consola** de DevTools (F12 → pestaña Console)

### Paso 3: Probar el Guardado

1. **Escribe un título**: "Casa de prueba"
2. **Mira la consola**, deberías ver (después de 300ms):
   ```
   💾 Borrador guardado automáticamente: {titulo: "Casa de prueba", ...}
   ```

3. **Selecciona un tipo**: Departamento
4. **Mira la consola** nuevamente, deberías ver otro guardado

5. **Cambia de pestaña** (abre Google en otra pestaña)
6. **Mira la consola**, deberías ver:
   ```
   🔄 Usuario cambió de pestaña - guardando inmediatamente
   💾 Borrador guardado automáticamente: {titulo: "Casa de prueba", tipo: "departamento", ...}
   ```

7. **Vuelve a la pestaña** del formulario
8. **Mira la consola**, deberías ver:
   ```
   👁️ Usuario volvió a la pestaña
   ```

9. **Refresca la página** (F5)
10. **Mira la consola**, deberías ver:
    ```
    🔍 Verificando si hay borrador guardado...
    Borrador encontrado: SÍ
    📝 Datos del borrador: {titulo: "Casa de prueba", tipo: "departamento", ...}
    ✅ Borrador cargado exitosamente
    ```

11. **Verifica el formulario**: Todos los datos deberían estar ahí

## 🐛 Logs que Verás

### Al Escribir en el Formulario
```
💾 Borrador guardado automáticamente: {
  titulo: "Casa de prueba",
  tipo: "departamento",
  precio: 0,
  ubicacion: "",
  timestamp: "12:34:56"
}
```

### Al Cambiar de Pestaña
```
🔄 Usuario cambió de pestaña - guardando inmediatamente
💾 Borrador guardado automáticamente: {...}
```

### Al Volver a la Pestaña
```
👁️ Usuario volvió a la pestaña
```

### Al Recargar la Página
```
🔍 Verificando si hay borrador guardado...
Borrador encontrado: SÍ
📝 Datos del borrador: {...}
✅ Borrador cargado exitosamente
```

### Si el Formulario Está Vacío
```
⏭️ No guardar: formulario vacío
```

## ❌ Problemas Comunes

### Problema 1: No se guarda nada
**Síntomas**: No ves mensajes de "💾 Borrador guardado"

**Posibles causas**:
1. El formulario está vacío (no has escrito título, descripción, precio o ubicación)
2. El navegador tiene el código viejo en caché
3. localStorage está deshabilitado

**Solución**:
1. Haz **Ctrl+Shift+R** para limpiar caché
2. Escribe al menos el **título**
3. Verifica que localStorage esté habilitado en la consola:
   ```javascript
   localStorage.setItem('test', 'test')
   localStorage.getItem('test')
   ```

### Problema 2: Se guarda pero no se carga
**Síntomas**: Ves "💾 Borrador guardado" pero al recargar no aparece

**Posibles causas**:
1. El borrador se está limpiando por algún motivo
2. Hay un error al parsear el JSON

**Solución**:
1. Mira la consola al recargar
2. Deberías ver "🔍 Verificando si hay borrador guardado..."
3. Si ves "Borrador encontrado: NO", verifica en DevTools → Application → Local Storage → http://localhost:3001
4. Busca la clave: `property-form-draft`

### Problema 3: Se pierde al cambiar de pestaña
**Síntomas**: Cambias de pestaña y al volver está vacío

**Posibles causas**:
1. El evento `visibilitychange` no se está disparando
2. El navegador tiene el código viejo

**Solución**:
1. Haz **Ctrl+Shift+R** para limpiar caché
2. Verifica en la consola que veas "🔄 Usuario cambió de pestaña"
3. Si no ves ese mensaje, el código viejo está en caché

## 🔧 Verificar Manualmente el localStorage

Abre la consola y ejecuta:

```javascript
// Ver el borrador guardado
localStorage.getItem('property-form-draft')

// Ver todo el localStorage
console.table(localStorage)

// Limpiar el borrador manualmente
localStorage.removeItem('property-form-draft')
```

## 📊 Reporte de Errores

Si sigue sin funcionar, copia y pega en un mensaje:

1. **Todos los logs** que aparecen en la consola
2. **El contenido de localStorage**:
   ```javascript
   localStorage.getItem('property-form-draft')
   ```
3. **Los pasos exactos** que seguiste:
   - Qué escribiste
   - Cuándo cambiaste de pestaña
   - Qué pasó al volver

## ✅ Checklist de Verificación

- [ ] Limpiaste la caché del navegador (Ctrl+Shift+R)
- [ ] Abriste la consola de DevTools
- [ ] Escribiste al menos un título
- [ ] Viste el mensaje "💾 Borrador guardado automáticamente"
- [ ] Cambiaste de pestaña
- [ ] Viste el mensaje "🔄 Usuario cambió de pestaña"
- [ ] Refrescaste la página (F5)
- [ ] Viste el mensaje "✅ Borrador cargado exitosamente"
- [ ] Los datos están en el formulario

Si todos estos pasos funcionan ✅, entonces el guardado automático está trabajando correctamente.

Si falla algún paso ❌, revisa los logs en la consola y reporta cuál paso falló.
