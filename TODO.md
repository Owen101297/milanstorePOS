# Preparación para Coolify - Progreso

✅ **PROYECTO LISTO PARA COOLIFY**

- Dockerfile standalone optimizado
- .dockerignore limpio
- next.config.js con output: 'standalone'
- .env.example listo
- README con instrucciones
- docker-compose.yml para local
- Healthcheck /api/health
- Fix bug app/test/page.js (build error)

**Próximos pasos:**
1. Copia `.env.example` → `.env` con tus Supabase keys
2. `npm run build` (ahora debe pasar)
3. `docker compose up --build` test local
4. Git push a repo conectado a Coolify + set env vars

Coolify detectará Dockerfile auto.

