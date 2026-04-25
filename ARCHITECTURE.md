# 🏗️ Arquitectura — Milan POS

> Documentación técnica del sistema punto de venta Milan Store.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x |
| Estado | Zustand (persist) | 5.x |
| Base de datos | Supabase (PostgreSQL + RLS) | — |
| Gráficos | Recharts | 2.x |
| Iconos | Lucide React | — |
| Fuente | Montserrat (next/font/google) | — |

---

## Estructura de Directorios

```
create-milan-pos/
├── app/
│   ├── layout.tsx          # Root layout (font, metadata, providers)
│   ├── page.tsx            # Main router + RBAC + lazy loading
│   └── globals.css         # Tailwind + custom styles
├── components/pos/
│   ├── Dashboard.tsx       # Dashboard real-time (Supabase)
│   ├── Sidebar.tsx         # Navigation (RBAC filtered)
│   ├── Topbar.tsx          # User info + logout
│   ├── auth/Login.tsx      # Auth + demo login
│   ├── providers/
│   │   └── SedeContext.tsx  # Sede selection context
│   └── modules/
│       ├── Vender.tsx      # POS orchestrator (55 lines)
│       ├── vender/         # Decomposed POS subcomponents
│       │   ├── types.ts        # Types, mock data, utils
│       │   ├── useVenderStore.ts # All state + business logic
│       │   ├── AperturaCaja.tsx  # Cash register opening
│       │   ├── ProductGrid.tsx   # Product search + grid
│       │   ├── CartPanel.tsx     # Cart + totals + actions
│       │   ├── PaymentModal.tsx  # Payment flow
│       │   └── Modals.tsx        # 7 secondary modals
│       ├── Inventario.tsx
│       ├── Ventas.tsx
│       ├── Informes.tsx
│       ├── Tienda.tsx
│       └── ConfiguracionNegocio.tsx
├── hooks/
│   ├── useAuth.ts          # Supabase auth + profile
│   ├── useBarcodeScanner.ts # USB/BT barcode detection
│   └── useNetworkMonitor.ts # Offline sync engine
├── lib/
│   ├── rbac.tsx            # Role-based access control
│   ├── database.types.ts   # Supabase schema types
│   ├── supabase/client.ts  # Browser Supabase client
│   └── services/           # Service layer (Supabase CRUD)
│       ├── index.ts              # Barrel export
│       ├── productos.service.ts  # Products/variants/categories
│       ├── ventas.service.ts     # Sales + cash register
│       ├── inventario.service.ts # Stock/Kardex/transfers
│       └── reportes.service.ts   # Dashboard + financial reports
├── store/
│   └── posStore.ts         # Zustand global store
└── supabase/
    ├── 00_setup_complete.sql   # Full schema + triggers
    └── 01_indexes_views.sql    # Performance indexes + views
```

---

## Flujos Principales

### 1. Autenticación

```
Login → Supabase Auth → useAuth hook → posStore.setUser()
              ↓
     perfil (nombre, rol, sede)
              ↓
     posStore.currentRole → RBAC filtering
```

### 2. Venta (POS)

```
ProductGrid → addToCart() → CartPanel → openPaymentModal()
                                              ↓
                                        PaymentModal
                                              ↓
                                        completeSale()
                                              ↓
                                  ventas.procesarVenta()
                                              ↓
                              INSERT venta (PENDIENTE)
                              INSERT detalles
                              UPDATE venta → COMPLETADA
                                              ↓
                              [TRIGGER] trg_procesar_venta
                                              ↓
                              INSERT kardex (VENTA)
                                              ↓
                              [TRIGGER] fn_procesar_kardex
                                              ↓
                              UPDATE stock_fisico ✓
```

### 3. Offline Sync

```
navigator.onLine === false
        ↓
  Venta → offlineQueue (Zustand persist)
        ↓
navigator.onLine === true
        ↓
  useNetworkMonitor.flushQueue()
        ↓
  ventas.procesarVenta() (por cada pendiente)
        ↓
  markSynced() → clearQueue()
```

### 4. RBAC

```
                   ┌─────────────────────────────┐
                   │   lib/rbac.tsx               │
                   │                             │
                   │  MODULE_PERMISSIONS = {     │
                   │    admin: [ALL],            │
                   │    gerente: [most],         │
                   │    cajero: [vender,ventas], │
                   │    bodeguero: [inventario]  │
                   │  }                          │
                   └─────────────────────────────┘
                            ↓
              ┌─────────────────────────┐
              │ Sidebar.tsx             │
              │ .filter(hasModuleAccess)│ → Oculta menús
              └─────────────────────────┘
              ┌─────────────────────────┐
              │ page.tsx                │
              │ if (!hasModuleAccess)   │ → AccessDenied
              │ RoleGate(admin-only)    │ → Protege Config
              └─────────────────────────┘
```

---

## Service Layer

Cada servicio sigue el patrón:

```typescript
// Singleton client
let _supabase = null
function getClient() { ... }

// Funciones async tipadas
export async function getProductos(sedeId?: string): Promise<ProductoConVariantes[]> {
  const { data, error } = await getClient()
    .from('productos')
    .select('*, variantes(*)')
  if (error) throw new Error(...)
  return data
}
```

**Importación:**
```typescript
import { productos, ventas, inventario, reportes } from '@/lib/services'
```

---

## Convenciones

| Aspecto | Convención |
|---------|-----------|
| Archivos | `PascalCase.tsx` para componentes, `camelCase.ts` para lógica |
| Servicios | `nombre.service.ts` — uno por dominio |
| Hooks | `use*.ts` — prefijo `use` |
| Roles | `admin`, `gerente`, `cajero`, `bodeguero` |
| Moneda | `formatCOP()` — siempre `$ X.XXX` |
| Errores | `throw new Error()` en services, `try/catch` en components |
| Estado auth | `usePosStore(s => s.currentUser)` → `UserInfo | null` |
