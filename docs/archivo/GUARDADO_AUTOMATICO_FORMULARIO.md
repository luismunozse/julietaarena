# Guardado Automático del Formulario de Propiedades

## ✅ Problema Resuelto

**Antes**: Si salías de la página mientras completabas el formulario, perdías todos los datos ingresados.

**Ahora**: El formulario guarda automáticamente tu progreso en localStorage y lo recupera cuando vuelves.

## 🚀 Cómo Funciona

### 1. Guardado Automático
- Cada vez que modificas un campo del formulario, los datos se guardan automáticamente
- El guardado ocurre **300ms** después del último cambio (debounce rápido)
- **Guardado inmediato** cuando:
  - 🔄 Cambias de pestaña del navegador
  - ❌ Cierras la pestaña
  - 🔃 Refrescas la página
  - 🚪 Navegas a otra página
- Solo guarda si hay contenido en el formulario (no guarda formularios vacíos)
- Solo funciona en modo **creación** (no afecta la edición de propiedades existentes)

### 2. Recuperación de Datos
- Al volver a la página de nueva propiedad, el formulario detecta si hay un borrador guardado
- Automáticamente carga los datos del borrador
- Muestra un indicador amarillo en la parte superior con:
  - 📝 "Borrador guardado automáticamente"
  - Botón para limpiar el borrador y empezar de cero

### 3. Limpieza Automática
El borrador se elimina automáticamente cuando:
- ✅ La propiedad se crea exitosamente
- 🗑️ Haces clic en el botón "Limpiar borrador" y confirmas

## 📋 Características

### Seguridad
- ✅ No interfiere con la edición de propiedades existentes
- ✅ No guarda borradores cuando estás enviando el formulario
- ✅ Solo guarda en localStorage (local a tu navegador)
- ✅ Pide confirmación antes de eliminar el borrador

### UX Mejorada
- 💾 Guardado silencioso en segundo plano
- 📝 Indicador visible cuando hay un borrador
- 🔄 Recuperación automática al volver a la página
- 🎯 Confirmación antes de eliminar datos

## 🎨 Indicador Visual

Cuando hay un borrador guardado, verás una barra amarilla brillante en la parte superior del formulario:

```
┌──────────────────────────────────────────────┐
│ 📝 Borrador guardado automáticamente         │
│                      [🗑️ Limpiar borrador]  │
└──────────────────────────────────────────────┘
```

## 🧪 Cómo Probarlo

1. **Ir a crear nueva propiedad**: http://localhost:3001/admin/propiedades/nueva
2. **Empezar a llenar el formulario**:
   - Título: "Departamento en Nueva Córdoba"
   - Descripción: "Hermoso departamento..."
   - Precio: 150000
   - etc.
3. **Navegar a otra página** (por ejemplo, ir a "Mis Propiedades")
4. **Volver a "Nueva Propiedad"**
5. **Verificar**: Todos los datos que completaste deberían estar ahí
6. **Ver el indicador amarillo** que confirma que hay un borrador guardado

## 🔧 Implementación Técnica

### Archivos Modificados

#### 1. `src/components/PropertyForm.tsx`
- Agregado estado `hasDraft` para controlar el indicador
- useEffect para cargar borrador al montar el componente
- useEffect con debounce para guardar automáticamente
- Función `clearDraft()` para limpiar el borrador
- Indicador visual del borrador guardado

#### 2. `src/components/PropertyForm.module.css`
- Estilos para `.draftNotice` - contenedor del indicador
- Estilos para `.draftInfo` - layout del indicador
- Estilos para `.clearDraftButton` - botón de limpiar
- Responsive design para móviles

#### 3. `src/app/admin/propiedades/nueva/page.tsx`
- Llamada a `clearDraft()` cuando la propiedad se crea exitosamente
- Limpieza del localStorage después de envío exitoso

### Clave de localStorage
```typescript
const DRAFT_STORAGE_KEY = 'property-form-draft'
```

### Lógica de Guardado

#### 1. Guardado con Debounce (300ms)
```typescript
const saveDraft = useCallback(() => {
  if (formData.id || isSubmitting) return

  const isFormEmpty = !formData.title && !formData.description && !formData.price && !formData.location
  if (isFormEmpty) return

  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
  console.log('💾 Borrador guardado automáticamente')
}, [formData, isSubmitting])

// Guardar 300ms después del último cambio
useEffect(() => {
  const timeoutId = setTimeout(() => {
    saveDraft()
  }, 300) // ⚡ Más rápido que antes (era 1000ms)

  return () => clearTimeout(timeoutId)
}, [saveDraft])
```

#### 2. Guardado Inmediato al Cambiar de Pestaña
```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 🔄 Usuario cambió de pestaña, guardar AHORA
      saveDraft()
    }
  }

  const handleBeforeUnload = () => {
    // 🚪 Usuario cierra o refresca, guardar AHORA
    saveDraft()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('beforeunload', handleBeforeUnload)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}, [saveDraft])
```

## 💡 Ventajas

1. **Sin pérdida de datos**: Nunca más perderás tu progreso
2. **Cero configuración**: Funciona automáticamente
3. **No invasivo**: No interrumpe tu flujo de trabajo
4. **Reversible**: Puedes limpiar el borrador cuando quieras
5. **Inteligente**: Solo guarda cuando tiene sentido hacerlo

## ⚠️ Limitaciones

- Los borradores se guardan en el navegador (localStorage)
- Si cambias de navegador, no verás el borrador
- Si limpias los datos del navegador, se perderá el borrador
- Solo funciona para **nuevas propiedades** (no para ediciones)

## 🔮 Futuras Mejoras Potenciales

- [ ] Guardar múltiples borradores con timestamps
- [ ] Sincronizar borradores con el servidor (Supabase)
- [ ] Restaurar automáticamente después de errores de red
- [ ] Notificación push cuando hay borrador guardado
- [ ] Vista previa del borrador antes de restaurarlo

## 📊 Logs en Consola

Cuando uses el formulario, verás estos logs útiles:

```
💾 Borrador guardado automáticamente  // Al guardar
📝 Borrador cargado desde localStorage // Al recuperar
🗑️ Borrador eliminado                 // Al limpiar
```

Esto te ayuda a entender cuándo se está guardando y recuperando el borrador.
