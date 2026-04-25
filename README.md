# Milan Retail POS — Next-Gen Retail Engine

Este proyecto es la evolución del sistema POS hacia una arquitectura moderna, robusta y escalable, manteniendo una **paridad visual y funcional 1:1** con el sistema legacy de Vendty.

---

## 🏛️ Filosofía de Diseño (Estándar de Oro)

**CRÍTICO:** Este sistema no admite diseños genéricos, básicos o de tipo "plantilla". Cada mejora, cambio o implementación debe cumplir con los siguientes estándares de calidad:

1.  **Diseño Profesional y Minimalista:** La interfaz debe ser limpia, balanceada y libre de ruido visual. Se prioriza la legibilidad y la eficiencia operativa.
2.  **No a lo Genérico:** Evitar componentes estándar sin personalizar. Cada botón, modal, tabla y grid debe ser refinado para sentirse como una herramienta de nivel mundial (World-Class).
3.  **Réplica de Alta Fidelidad:** Cuando se trabaje en módulos de Vendty, la paridad debe ser absoluta (Pixel-Perfect) tanto en el diseño visual como en la lógica de negocio subyacente.
4.  **Estética Premium:** Uso de paletas de colores armoniosas, sombras sutiles, micro-animaciones y tipografías modernas (Montserrat/Sans) para crear una experiencia de usuario superior.

---

## 🎨 Sistema de Diseño (Design System)

El proyecto implementa un **sistema de diseño tokenizado** para garantizar consistencia y accesibilidad WCAG 2.2 AA.

### Tokens de Diseño

| Categoría | Archivo | Descripción |
|-----------|---------|-------------|
| Tokens semánticos | `app/globals.css` (`:root`) | Variables CSS para colores, tipografía, espaciado |
| Configuración Tailwind | `tailwind.config.ts` | Extensión del tema con tokens de marca |
| Documentación | `DESIGN_SYSTEM.md` | Guía completa de implementación |

### Tokens Disponibles

**Colores:**
```css
--color-brand-primary: #62cb31   /* Verde Vendty */
--color-brand-dark: #333          /* Sidebar oscuro */
--color-text-primary: #f3f7f9     /* Texto sobre oscuro */
--color-text-tertiary: #6a6c6f     /* Texto terciario */
```

**Tipografía:**
- Familia: `Montserrat`, sans-serif
- Tamaños: `13px` (xs), `14px` (sm/base), `16px` (lg)
- Pesos: `300` (light), `400` (normal), `500` (medium), `700` (bold), `900` (black)

**Espaciado:**
- `10px`, `15px`, `20px`, `22px`, `30px`, `40px`, `100px`

### Reglas de Accesibilidad

- **Contraste mínimo:** 4.5:1 para texto, 3:1 para componentes UI
- **Focus visible:** Todos los elementos interactivos deben tener estado `focus-visible`
- **ARIA labels:** Requeridos en navegación, botones con íconos, y elementos dinámicos
- **Touch targets:** Mínimo 44x44px

### Estados de Componentes

Cada componente debe implementar:
- Default, Hover, Active, Focus-visible, Disabled, Loading, Error

### Anti-Patrones Prohibidos

- ❌ Valores hex hardcodeados (usar tokens CSS)
- ❌ `<div onClick>` como sustituto de `<button>`
- ❌ Estados focus omitidos
- ❌ Etiquetas ambiguas ("Click aquí")
- ❌ Google Fonts via `<link>` (usar `next/font`)

---

## 🚀 Estado del Proyecto (Contexto de Trabajo)

Actualmente, el sistema ha completado la migración de los pilares estructurales:

-   **Dashboard Inteligente:** Métricas con indicadores de crecimiento, gráficos avanzados (Recharts) y tendencia semanal 1:1.
-   **Módulo Vender (POS):** Carrito optimizado, búsqueda de productos en lista/grid, gestión de clientes y modal de pagos múltiples (Efectivo, Tarjeta, Transferencia, Crédito).
-   **Navegación Dual:** Sidebar con panel persistente de submenús y Topbar con selector de aplicaciones y menú de usuario.
-   **Infraestructura:** Integración total con Supabase para datos reales y Zustand para la gestión de estado ultra-rápida.
-   **Sistema de Diseño:** Tokens semánticos implementados, accesibilidad WCAG 2.2 AA, focus-visible en todos los componentes.

---

## 🛠️ Stack Tecnológico

-   **Frontend:** Next.js 15+ (App Router), React 19.
-   **Estilos:** Tailwind CSS con tokens de diseño semánticos (`brand.primary`, `status.error`, etc.).
-   **Estado:** Zustand (Slices especializados por módulo).
-   **Backend/DB:** Supabase (Auth, RLS, Storage, Realtime).
-   **Gráficos:** Recharts.
-   **Accesibilidad:** Contraste WCAG 2.2 AA, ARIA patterns, focus management.

---

## 📋 Guía de Implementación para Desarrolladores

Para cualquier tarea nueva, seguir este flujo de trabajo:

1.  **Investigación de Paridad:** Revisar las capturas y el código fuente de Vendty para entender la lógica y el diseño original.
2.  **Diseño de Componente:** Antes de codear, definir los estados visuales (Hover, Active, Loading, Empty) según `DESIGN_SYSTEM.md`.
3.  **Uso de Tokens:** Implementar estilos usando tokens CSS (`var(--color-brand-primary)`) o clases Tailwind (`text-brand-primary`).
4.  **Lógica de Estado:** Implementar el store (Zustand) asegurando que la lógica de negocio (descuentos, impuestos, saldos) sea idéntica a la original.
5.  **Integración Supabase:** Conectar con los servicios en `lib/services/` para persistencia real.
6.  **Auditoría de Accesibilidad:** Verificar focus-visible, contraste y ARIA labels.
7.  **Auditoría Final:** Verificar que el diseño NO se vea genérico y que cada botón y modal sea profesional y minimalista.

---

## 📦 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Puerto 3002 por defecto)
npm run dev
```

### Verificación de Calidad

```bash
# Linting
npm run lint

# TypeScript
npm run typecheck

# Tests
npm test
```

---

## 📁 Estructura de Archivos Clave

```
├── app/
│   ├── globals.css          # Tokens CSS y estilos base
│   └── vendty-styles.css    # Estilos legacy (migración en progreso)
├── components/pos/
│   ├── Dashboard.tsx        # Dashboard con métricas y gráficos
│   ├── Sidebar.tsx          # Navegación lateral con submenús
│   ├── Topbar.tsx           # Barra superior con usuario y apps
│   └── auth/Login.tsx       # Página de login
├── DESIGN_SYSTEM.md         # Documentación del sistema de diseño
├── tailwind.config.ts       # Extensión de tema con tokens
├── standards.json           # Estándares de código y arquitectura
└── ARCHITECTURE.md          # Arquitectura del sistema
```

---

*Desarrollado con excelencia para el ecosistema retail de Milan Clothing Store.*