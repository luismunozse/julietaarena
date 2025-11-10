# Guía de Testing - Julieta Arena

Esta guía explica cómo ejecutar y escribir tests para el proyecto.

## Índice

1. [Configuración Actual](#configuración-actual)
2. [Ejecutar Tests](#ejecutar-tests)
3. [Tests Existentes](#tests-existentes)
4. [Escribir Nuevos Tests](#escribir-nuevos-tests)
5. [Testing E2E con Playwright](#testing-e2e-con-playwright)
6. [Best Practices](#best-practices)

---

## Configuración Actual

El proyecto está configurado con:

- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes React
- **@testing-library/user-event** - Simular interacciones de usuario
- **@testing-library/jest-dom** - Matchers personalizados para DOM

### Archivos de Configuración

- `jest.config.js` - Configuración principal de Jest
- `jest.setup.js` - Setup global (mocks de window, localStorage, etc.)
- `package.json` - Scripts de testing

---

## Ejecutar Tests

### Comandos Disponibles

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (re-ejecuta al guardar)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar en modo CI (para GitHub Actions, etc.)
npm run test:ci
```

### Ejecutar Tests Específicos

```bash
# Ejecutar un archivo específico
npm test -- PropertyCard.test.tsx

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="renderiza el título"

# Ejecutar tests de un directorio
npm test -- src/components/__tests__/
```

---

## Tests Existentes

### Componentes

#### PropertyCard.test.tsx

Tests para el componente de tarjeta de propiedad:

- ✅ Renderiza título, precio, ubicación
- ✅ Muestra características (dormitorios, baños, área)
- ✅ Muestra badges (Destacada, Disponible)
- ✅ Renderiza imágenes correctamente
- ✅ Fallback a placeholder si no hay imágenes

**Ejecutar:**
```bash
npm test -- PropertyCard.test.tsx
```

### Hooks

#### useProperties.test.ts

Tests para el hook de gestión de propiedades:

- ✅ Inicializa con estado de carga
- ✅ Carga propiedades desde Supabase
- ✅ Maneja errores y fallback a localStorage
- ✅ Busca propiedades por ID

**Ejecutar:**
```bash
npm test -- useProperties.test.ts
```

---

## Escribir Nuevos Tests

### Estructura de un Test

```typescript
import { render, screen } from '@testing-library/react'
import MiComponente from '../MiComponente'

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />)
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument()
  })
})
```

### Tests de Componentes

#### Ejemplo: Test de un botón con click

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MiBoton from '../MiBoton'

describe('MiBoton', () => {
  it('ejecuta onClick cuando se hace click', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<MiBoton onClick={handleClick}>Click Me</MiBoton>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Ejemplo: Test de formulario

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../ContactForm'

describe('ContactForm', () => {
  it('envía el formulario con datos válidos', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()

    render(<ContactForm onSubmit={handleSubmit} />)

    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/mensaje/i), 'Hola, me interesa una propiedad')

    // Enviar
    await user.click(screen.getByRole('button', { name: /enviar/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      mensaje: 'Hola, me interesa una propiedad'
    })
  })

  it('muestra errores de validación', async () => {
    const user = userEvent.setup()

    render(<ContactForm onSubmit={jest.fn()} />)

    // Intentar enviar sin llenar
    await user.click(screen.getByRole('button', { name: /enviar/i }))

    // Verificar mensajes de error
    expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument()
  })
})
```

### Tests de Hooks

#### Ejemplo: Test de un custom hook

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFavorites } from '../useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('agrega una propiedad a favoritos', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite('prop-123')
    })

    expect(result.current.favorites).toContain('prop-123')
    expect(result.current.isFavorite('prop-123')).toBe(true)
  })

  it('elimina una propiedad de favoritos', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite('prop-123')
      result.current.removeFavorite('prop-123')
    })

    expect(result.current.favorites).not.toContain('prop-123')
    expect(result.current.isFavorite('prop-123')).toBe(false)
  })
})
```

### Mocks Comunes

#### Mock de Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}))
```

#### Mock de Next.js Image

```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))
```

#### Mock de Supabase

```typescript
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}))
```

#### Mock de localStorage

Ya está configurado en `jest.setup.js`, pero puedes usarlo así:

```typescript
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('key', 'value')
})

test('usa localStorage', () => {
  expect(localStorage.getItem).toHaveBeenCalledWith('key')
})
```

---

## Testing E2E con Playwright

### Instalación

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuración

Crear `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Ejemplo de Test E2E

Crear `e2e/busqueda-propiedad.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('buscar y ver detalles de una propiedad', async ({ page }) => {
  // Ir a la página principal
  await page.goto('/')

  // Verificar que cargó correctamente
  await expect(page).toHaveTitle(/Julieta Arena/)

  // Buscar "Palermo"
  await page.fill('input[placeholder*="ubicación"]', 'Palermo')
  await page.click('button:has-text("Buscar")')

  // Esperar resultados
  await page.waitForSelector('.property-card')

  // Verificar que hay resultados
  const results = await page.locator('.property-card').count()
  expect(results).toBeGreaterThan(0)

  // Click en la primera propiedad
  await page.click('.property-card:first-child')

  // Verificar que estamos en la página de detalles
  await expect(page).toHaveURL(/\/propiedades\//)
  await expect(page.locator('h1')).toBeVisible()

  // Verificar que hay imágenes
  await expect(page.locator('.property-gallery img')).toBeVisible()

  // Verificar que hay formulario de contacto
  await expect(page.locator('input[name="nombre"]')).toBeVisible()
})

test('agregar propiedad a favoritos', async ({ page }) => {
  await page.goto('/propiedades/prop-1')

  // Click en botón de favoritos
  await page.click('button[aria-label*="favorito"]')

  // Verificar que se agregó
  await expect(page.locator('button[aria-label*="favorito"]')).toHaveClass(/active/)

  // Ir a favoritos
  await page.click('a:has-text("Favoritos")')

  // Verificar que la propiedad está en favoritos
  await expect(page.locator('.property-card')).toHaveCount(1)
})
```

### Ejecutar Tests E2E

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar en modo UI
npx playwright test --ui

# Ejecutar en modo debug
npx playwright test --debug

# Generar reporte
npx playwright show-report
```

---

## Best Practices

### 1. Queries de Testing Library

**Prioridad de queries (de mejor a peor):**

1. `getByRole` - Accesibilidad
2. `getByLabelText` - Formularios
3. `getByPlaceholderText` - Inputs
4. `getByText` - Contenido visible
5. `getByTestId` - Último recurso

```typescript
// ✅ Bueno
screen.getByRole('button', { name: /enviar/i })
screen.getByLabelText(/nombre/i)

// ❌ Malo
screen.getByTestId('submit-button')
```

### 2. Async Testing

Usar `waitFor` para operaciones asíncronas:

```typescript
await waitFor(() => {
  expect(screen.getByText(/cargado/i)).toBeInTheDocument()
})
```

### 3. Cleanup

No es necesario limpiar manualmente, React Testing Library lo hace automáticamente.

### 4. Organización

```
src/
  components/
    Button.tsx
    __tests__/
      Button.test.tsx
  hooks/
    useAuth.ts
    __tests__/
      useAuth.test.ts
e2e/
  login.spec.ts
  busqueda.spec.ts
```

### 5. Cobertura de Código

Objetivo: **80%** de cobertura mínima

```bash
npm run test:coverage
```

Ver reporte en: `coverage/lcov-report/index.html`

---

## Troubleshooting

### Error: "Cannot find module '@/...'"

Verifica que `jest.config.js` tenga el `moduleNameMapper` correcto:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Error: "document is not defined"

Asegúrate de que `testEnvironment` esté configurado:

```javascript
testEnvironment: 'jest-environment-jsdom'
```

### Tests muy lentos

- Usa `test.only()` para ejecutar solo un test
- Usa `npm run test:watch` en lugar de re-ejecutar manualmente
- Considera usar `--maxWorkers=50%` para limitar workers

---

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Scripts Útiles

### Generar test desde componente (opcional)

Puedes crear un script para generar tests automáticamente:

```bash
# scripts/generate-test.sh
#!/bin/bash
COMPONENT=$1
cat > "src/components/__tests__/${COMPONENT}.test.tsx" << EOF
import { render, screen } from '@testing-library/react'
import ${COMPONENT} from '../${COMPONENT}'

describe('${COMPONENT}', () => {
  it('renderiza correctamente', () => {
    render(<${COMPONENT} />)
    // Agregar assertions aquí
  })
})
EOF
```

Uso:
```bash
chmod +x scripts/generate-test.sh
./scripts/generate-test.sh PropertyCard
```

---

¿Necesitas ayuda? Consulta los tests existentes en `src/components/__tests__/` y `src/hooks/__tests__/` como ejemplos.
