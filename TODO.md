# 📋 TODO — Milan POS Reconstruction

> Última actualización: 2026-04-23 (Fases 1-5 completadas)

---

## ✅ Fase 1: Estabilización (COMPLETADA)

- [x] **#23** — Proteger secrets → `.gitignore`
- [x] **#4** — Eliminar Bootstrap 3 CDN, migrar fonts a `next/font/google`
- [x] **#5** — TypeScript strict + corregir todos los tipos
- [x] **#10** — Fix Topbar, Login, useAuth
- [x] **#19** — Generar `lib/database.types.ts`
- [x] **#28** — Unificar puertos

---

## ✅ Fase 2: Service Layer + Datos Reales (COMPLETADA)

- [x] **#3** — Service Layer: `lib/services/*.service.ts`
- [x] **#13-16** — Servicios: productos, ventas, inventario, reportes
- [x] **#9** — Dashboard con datos reales de Supabase

---

## ✅ Fase 3: RBAC + Offline Sync (COMPLETADA)

- [x] **#6** — RBAC en Sidebar
- [x] **#7** — RBAC en page.tsx + lazy loading
- [x] **#11** — useNetworkMonitor integrado
- [x] **#17** — Offline Sync Engine → Supabase
- [x] **#20-21** — 12 índices + 5 vistas SQL

---

## ✅ Fase 4: Refactoring + Seguridad + Docs (COMPLETADA)

- [x] **#8** — Vender.tsx: 1434 → 55 líneas + 7 subcomponentes
- [x] **#22** — RLS: 10 tablas aseguradas
- [x] **#1** — `ARCHITECTURE.md`

---

## ✅ Fase 5: Testing + Rate Limiting + Standards (COMPLETADA)

- [x] **#25** — Vitest + Testing Library instalado y configurado
- [x] **#26** — 45 tests unitarios (4 suites)
  - `rbac.test.ts` — 10 tests (permisos por rol)
  - `vender-store.test.ts` — 16 tests (carrito, totales, hold/resume)
  - `utils.test.ts` — 13 tests (formatCOP, parseNumber, etc)
  - `rate-limit.test.ts` — 6 tests (token bucket, reset, cleanup)
- [x] **#24** — Rate Limiter (token bucket, 4 instancias pre-configuradas)
- [x] **#2** — `standards.json` — convenciones de código y patrones

### Resultado Fase 5
- ✅ `npm test` → **45/45 tests passing** (2.3s)
- ✅ `npx tsc --noEmit` → **0 errores**
- ✅ Rate limiter: API (60/min), Auth (5/min), Sales (120/min), Reports (10/min)
- ✅ Standards definidos con patrones prohibidos y convenciones

---

## 🔜 Fase 6: Production Polish (Siguiente)

- [ ] **#12** — Implementar módulos nativos (eliminar iframes legacy)
- [ ] **#18** — Integración Siigo/DIAN facturación electrónica
- [ ] **#27** — Tests E2E (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoreo de errores (Sentry)
