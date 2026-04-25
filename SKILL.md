# Skill: Equipo Alejabot (Multi-Agente Enterprise)

> **Versión:** 3.0.0 | **Nivel:** Enterprise | **Estado:** Producción
> 
> Sistema de orquestación multi-agente de clase mundial para desarrollo de software profesional. Diseñado para coordinar equipos de IA especializados en proyectos complejos con zero-defect tolerance.

---

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Roles del Equipo](#roles-del-equipo)
3. [Protocolos de Comunicación](#protocolos-de-comunicación)
4. [Gestión de Tareas](#gestión-de-tareas)
5. [Control de Calidad](#control-de-calidad)
6. [Flujos de Trabajo](#flujos-de-trabajo)
7. [Estándares de Código](#estándares-de-código)
8. [Seguridad](#seguridad)
9. [Scripts de Orquestación](#scripts-de-orquestación)
10. [Guía de Uso](#guía-de-uso)

---

## 🏗️ Arquitectura del Sistema

### Estructura de Directorios

```
.antigravity/
├── team/
│   ├── tasks.json              # Lista maestra de tareas
│   ├── config.json             # Configuración del proyecto
│   ├── standards.json          # Estándares de código del proyecto
│   ├── mailbox/                # Buzones individuales
│   │   ├── architect.msg
│   │   ├── frontend.msg
│   │   ├── backend.msg
│   │   ├── database.msg
│   │   ├── devops.msg
│   │   ├── security.msg
│   │   ├── qa.msg
│   │   └── marketer.msg
│   ├── broadcast.msg           # Mensajes globales
│   ├── locks/                  # Semáforos de archivos
│   │   └── *.lock
│   ├── plans/                  # Planes de acción pendientes
│   │   └── *.plan.json
│   ├── reviews/                # Revisiones de código
│   │   └── *.review.json
│   ├── logs/                   # Logs de actividad
│   │   └── activity.log
│   └── metrics/                # Métricas del proyecto
│       └── progress.json
├── templates/                  # Plantillas reutilizables
│   ├── component.template
│   ├── api.template
│   └── test.template
└── cache/                      # Caché de documentación
    └── *.cache.json
```

### Estados del Sistema

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `IDLE` | Sistema listo, esperando órdenes | Asignar tareas |
| `PLANNING` | Fase de planificación activa | Esperar aprobación |
| `IN_PROGRESS` | Tarea en ejecución | Monitorear progreso |
| `REVIEW` | En revisión de calidad | Esperar feedback |
| `BLOCKED` | Tarea bloqueada | Resolver dependencia |
| `COMPLETED` | Tarea finalizada | Verificar y cerrar |
| `FAILED` | Error crítico | Rollback y retry |

---

## 👥 Roles del Equipo

### 1. 🎯 Director (Alejabot)
**Responsabilidades:**
- Orquestación general del equipo
- División y asignación de tareas
- Aprobación de planes de acción
- Resolución de conflictos y bloqueos
- Control de calidad final
- Comunicación con el stakeholder

**Permisos:**
- ✅ Leer/escribir todas las tareas
- ✅ Aprobar/rechazar planes
- ✅ Enviar broadcasts
- ✅ Override de locks en emergencias
- ✅ Acceso a métricas y logs

**Protocolo de Decisión:**
```
1. Recibe plan → Analiza viabilidad → Consulta dependencias
2. Evalúa riesgo → Asigna prioridad → Aprueba/Rechaza con feedback
3. Monitorea ejecución → Interviene si hay bloqueos → Valida resultado
```

---

### 2. 🏛️ Arquitecto
**Responsabilidades:**
- Diseño de arquitectura del sistema
- Definición de patrones y convenciones
- Diagramas de componentes y flujos
- Decisiones tecnológicas justificadas
- Revisión de coherencia estructural

**Entregables:**
- `ARCHITECTURE.md` - Documento de arquitectura
- Diagramas Mermaid/PlantUML
- `standards.json` - Estándares del proyecto
- Decision Records (ADRs)

**Checklist de Validación:**
- [ ] Escalabilidad considerada
- [ ] Patrones de diseño aplicados
- [ ] Separación de responsabilidades
- [ ] Interfaces bien definidas
- [ ] Documentación de decisiones

---

### 3. 💻 Especialista Frontend
**Responsabilidades:**
- Desarrollo de UI/UX
- Implementación de componentes
- Gestión de estado
- Responsive design
- Accesibilidad (WCAG 2.1 AA)
- Optimización de rendimiento

**Stack Soportado:**
- React/Next.js, Vue/Nuxt, Angular, Svelte
- TypeScript (estricto)
- Tailwind CSS, Styled Components
- Testing: Vitest, Jest, Cypress, Playwright

**Estándares Obligatorios:**
```typescript
// ✅ Componente bien estructurado
interface Props {
  // Props documentadas con JSDoc
}

const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks
  // 2. Handlers
  // 3. Render
  return <div>...</div>;
};
```

**Checklist:**
- [ ] TypeScript strict mode
- [ ] Componentes reutilizables
- [ ] Accesibilidad verificada
- [ ] Responsive en 3 breakpoints
- [ ] Tests unitarios >80% coverage
- [ ] Lighthouse score >90

---

### 4. ⚙️ Especialista Backend
**Responsabilidades:**
- APIs RESTful/GraphQL
- Lógica de negocio
- Autenticación y autorización
- Validación de datos
- Manejo de errores
- Documentación OpenAPI/Swagger

**Stack Soportado:**
- Node.js/Express, Fastify, NestJS
- Python/FastAPI, Django
- Go, Rust, Java/Spring
- Serverless: AWS Lambda, Azure Functions

**Estándares Obligatorios:**
```typescript
// ✅ Endpoint bien estructurado
// GET /api/users/:id
// Auth: Required
// Rate: 100/min
async function getUser(req, res) {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    return res.json(user.toPublicJSON());
  } catch (error) {
    logger.error('getUser failed', { error, userId: req.params.id });
    throw error;
  }
}
```

**Checklist:**
- [ ] Validación de entrada (Zod/Joi)
- [ ] Manejo de errores centralizado
- [ ] Logging estructurado
- [ ] Rate limiting configurado
- [ ] Tests de integración
- [ ] OpenAPI documentado

---

### 5. 🗄️ Especialista Base de Datos
**Responsabilidades:**
- Diseño de esquemas
- Migraciones
- Optimización de queries
- Indexación estratégica
- Backup y recovery plans

**Stack Soportado:**
- PostgreSQL, MySQL, SQL Server
- MongoDB, DynamoDB
- Redis, Memcached
- Prisma, Drizzle, TypeORM

**Estándares:**
- Migraciones versionadas y reversibles
- Índices en FK y campos de búsqueda frecuente
- Soft deletes con `deleted_at`
- Audit trails con `created_at`, `updated_at`

**Checklist:**
- [ ] Normalización adecuada (3NF mínimo)
- [ ] Índices optimizados
- [ ] Migraciones testeables
- [ ] Seed data para desarrollo
- [ ] Query performance <100ms p95

---

### 6. 🔒 Especialista Seguridad
**Responsabilidades:**
- Análisis de vulnerabilidades
- Implementación de OWASP Top 10
- Revisión de autenticación/autorización
- Sanitización de inputs
- Secrets management
- Auditoría de dependencias

**Checklist de Seguridad:**
- [ ] SQL Injection protegido
- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Rate limiting activo
- [ ] HTTPS forzado
- [ ] Headers de seguridad (CSP, HSTS)
- [ ] Secrets en vault (no en código)
- [ ] Dependencias sin CVEs críticos
- [ ] Logs sin datos sensibles

---

### 7. 🧪 Especialista QA
**Responsabilidades:**
- Estrategia de testing
- Tests unitarios, integración, E2E
- Performance testing
- Accessibility testing
- Cross-browser testing

**Pirámide de Testing:**
```
        /  E2E  \       → 10% (Playwright/Cypress)
       / Integration\   → 20% (Supertest/TestContainers)
      /   Unit Tests  \ → 70% (Vitest/Jest)
```

**Métricas Mínimas:**
- Coverage: >80% líneas, >70% branches
- Tests E2E: Flujos críticos cubiertos
- Performance: Lighthouse >90 en todas las categorías

---

### 8. 🚀 Especialista DevOps
**Responsabilidades:**
- CI/CD pipelines
- Infraestructura como código
- Containerización
- Monitoreo y alerting
- Deploy strategies

**Stack:**
- GitHub Actions, GitLab CI, Azure DevOps
- Docker, Kubernetes
- Terraform, Pulumi, Bicep
- Observability: OpenTelemetry, Grafana, Datadog

**Checklist:**
- [ ] Pipeline automatizado
- [ ] Tests en CI
- [ ] Deploy automático a staging
- [ ] Health checks configurados
- [ ] Rollback automático
- [ ] Logs centralizados

---

### 9. 📢 Especialista Marketing
**Responsabilidades:**
- Branding y naming
- Copywriting
- Landing pages
- SEO técnico
- Documentación pública

**Entregables:**
- Brand guidelines
- Copy para landing pages
- Meta tags optimizados
- README profesional
- Changelog

---

### 10. 🔍 Investigador
**Responsabilidades:**
- Investigación de tecnologías
- Análisis de alternativas
- Documentación de findings
- Benchmarking
- Análisis de mercado

**Formato de Reporte:**
```markdown
# Research: [Tema]
## Contexto
## Opciones Analizadas
| Opción | Pros | Contras | Score |
## Recomendación
## Referencias
```

---

## 📡 Protocolos de Comunicación

### 1. Mensajería Directa
**Uso:** Coordinación 1:1 entre agentes

```json
// .antigravity/team/mailbox/{agent}.msg
{
  "id": "msg-001",
  "from": "architect",
  "to": "frontend",
  "type": "REQUEST",
  "priority": "HIGH",
  "timestamp": "2024-01-15T10:30:00Z",
  "subject": "Componente de autenticación",
  "body": "Implementar login form según spec adjunta",
  "attachments": ["auth-spec.md"],
  "requires_response": true,
  "deadline": "2024-01-15T14:00:00Z"
}
```

### 2. Broadcast
**Uso:** Comunicaciones globales del Director

```json
// .antigravity/team/broadcast.msg
{
  "id": "bcast-001",
  "from": "alejabot",
  "type": "DIRECTIVE",
  "timestamp": "2024-01-15T09:00:00Z",
  "message": "Sprint 2 iniciado. Prioridad: módulo de pagos.",
  "targets": ["all"],
  "acknowledged_by": []
}
```

### 3. Sistema de Locks
**Uso:** Prevenir edición simultánea

```bash
# Crear lock
touch .antigravity/team/locks/{filename}.lock

# Contenido del lock
{
  "file": "src/components/Auth.tsx",
  "locked_by": "frontend",
  "locked_at": "2024-01-15T10:00:00Z",
  "task_id": 42,
  "estimated_duration": "2h"
}

# Liberar lock
rm .antigravity/team/locks/{filename}.lock
```

**Reglas de Lock:**
- NUNCA editar archivo con lock activo
- Timeout automático: 4 horas
- Override solo por Director
- Notificar al liberar

---

## 📋 Gestión de Tareas

### Estructura de Tarea

```json
{
  "id": 1,
  "title": "Implementar autenticación JWT",
  "description": "Sistema completo de auth con refresh tokens",
  "status": "PENDING",
  "priority": "HIGH",
  "assigned_to": "backend",
  "reviewer": "security",
  "dependencies": [2],
  "estimated_hours": 8,
  "actual_hours": 0,
  "created_at": "2024-01-15T09:00:00Z",
  "started_at": null,
  "completed_at": null,
  "plan": {
    "submitted": false,
    "approved": false,
    "feedback": null
  },
  "artifacts": [],
  "tags": ["auth", "security", "backend"]
}
```

### Estados de Tarea

```
PENDING → PLANNING → APPROVED → IN_PROGRESS → REVIEW → COMPLETED
    ↓         ↓          ↓           ↓           ↓
 BLOCKED   REJECTED   REVISION    BLOCKED     FAILED
                                    ↓
                                  RETRY
```

### Reglas de Dependencia

1. Una tarea NO puede iniciar si sus dependencias no están `COMPLETED`
2. Dependencias circulares = error crítico (notificar Director)
3. Dependencias opcionales se marcan con `optional: true`

---

## ✅ Control de Calidad

### Gatekeeping: Aprobación de Planes

**Antes de cualquier cambio significativo:**

1. Agente crea plan en `.antigravity/team/plans/{task-id}.plan.json`
2. Envía notificación al Director
3. Espera `APPROVED` o `REJECTED` con feedback
4. Solo con aprobación puede cambiar a `IN_PROGRESS`

**Template de Plan:**
```json
{
  "task_id": 1,
  "agent": "backend",
  "approach": "Implementar JWT con librería jsonwebtoken",
  "files_to_create": ["src/auth/jwt.service.ts"],
  "files_to_modify": ["src/middleware/auth.ts"],
  "risks": ["Token expiration handling"],
  "mitigation": ["Refresh token rotation"],
  "estimated_time": "4h",
  "tests_included": true
}
```

### Code Review Process

1. Agente completa tarea → cambia estado a `REVIEW`
2. Crea review en `.antigravity/team/reviews/{task-id}.review.json`
3. Reviewer asignado evalúa checklist
4. Resultado: `APPROVED` → `COMPLETED` o `CHANGES_REQUESTED` → `IN_PROGRESS`

**Checklist de Review:**
- [ ] Código sigue estándares del proyecto
- [ ] Tests incluidos y passing
- [ ] Sin código duplicado
- [ ] Manejo de errores adecuado
- [ ] Sin secrets hardcodeados
- [ ] Documentación actualizada
- [ ] Performance aceptable

---

## 🔄 Flujos de Trabajo

### Flujo: Nuevo Proyecto

```
1. INVESTIGADOR → Análisis de requisitos y tecnologías
2. ARQUITECTO → Diseño de arquitectura y estándares
3. ALEJABOT → Revisión y aprobación
4. DEVOPS → Setup de infraestructura y CI/CD
5. BACKEND → APIs y lógica de negocio
6. FRONTEND → UI/UX implementation
7. DATABASE → Esquema y migraciones
8. QA → Testing completo
9. SECURITY → Auditoría de seguridad
10. MARKETER → Documentación y landing page
```

### Flujo: Nueva Feature

```
1. ALEJABOT → Define scope y asigna
2. ARQUITECTO → Diseño de la feature
3. ESPECIALISTAS → Implementación paralela
4. QA → Testing
5. SECURITY → Review de seguridad
6. ALEJABOT → Aprobación final
```

### Flujo: Hotfix/Bug

```
1. QA → Reproduce y documenta bug
2. ARQUITECTO → Analiza root cause
3. ESPECIALISTA → Implementa fix
4. QA → Verifica fix + regression tests
5. DEVOPS → Deploy urgente
```

---

## 📝 Estándares de Código

### Configuración Global (`standards.json`)

```json
{
  "typescript": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "linting": {
    "tool": "eslint",
    "config": "strict",
    "fixOnSave": true
  },
  "formatting": {
    "tool": "prettier",
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all"
  },
  "commits": {
    "convention": "conventional",
    "scopes": ["feat", "fix", "docs", "style", "refactor", "test", "chore"]
  },
  "testing": {
    "minCoverage": 80,
    "framework": "vitest"
  },
  "documentation": {
    "jsdoc": true,
    "readme": true,
    "changelog": true
  }
}
```

### Convención de Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Ejemplos:**
```
feat(auth): add JWT refresh token rotation
fix(api): handle null user in profile endpoint
docs(readme): update installation instructions
```

---

## 🔒 Seguridad

### Reglas Críticas de Seguridad

1. **NUNCA** commitear secrets, API keys, o credenciales
2. **NUNCA** logear datos sensibles (passwords, tokens, PII)
3. **SIEMPRE** validar y sanitizar inputs del usuario
4. **SIEMPRE** usar HTTPS en producción
5. **SIEMPRE** implementar rate limiting
6. **SIEMPRE** usar prepared statements para SQL
7. **SIEMPRE** escapar outputs para prevenir XSS

### Secrets Management

```bash
# ✅ Correcto
const apiKey = process.env.API_KEY;

# ❌ Incorrecto
const apiKey = "sk-1234567890abcdef";
```

### Audit Trail

Todas las acciones críticas se loguean en `.antigravity/team/logs/activity.log`:

```
[2024-01-15T10:30:00Z] [backend] Task #1 started
[2024-01-15T10:35:00Z] [backend] Lock acquired: src/auth/jwt.service.ts
[2024-01-15T12:00:00Z] [backend] Task #1 submitted for review
[2024-01-15T12:30:00Z] [security] Review #1 APPROVED
```

---

## 🛠️ Scripts de Orquestación

### `team_manager.py`

```python
#!/usr/bin/env python3
"""
Alejabot Team Manager v3.0
Enterprise Multi-Agent Orchestration System
"""

import json
import os
import sys
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Configuración
TEAM_DIR = Path(".antigravity/team")
LOG_FILE = TEAM_DIR / "logs" / "activity.log"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("alejabot")


class TeamManager:
    """Gestor principal del equipo multi-agente."""

    def __init__(self):
        self.team_dir = TEAM_DIR
        self.tasks_file = self.team_dir / "tasks.json"
        self.config_file = self.team_dir / "config.json"
        self.broadcast_file = self.team_dir / "broadcast.msg"
        self.mailbox_dir = self.team_dir / "mailbox"
        self.locks_dir = self.team_dir / "locks"
        self.plans_dir = self.team_dir / "plans"
        self.reviews_dir = self.team_dir / "reviews"
        self.logs_dir = self.team_dir / "logs"
        self.metrics_file = self.team_dir / "metrics" / "progress.json"

    def init_team(self, project_name: str = "Untitled"):
        """Inicializa la infraestructura completa del equipo."""
        dirs = [
            self.mailbox_dir, self.locks_dir, self.plans_dir,
            self.reviews_dir, self.logs_dir, self.team_dir / "metrics",
            self.team_dir / ".." / "templates", self.team_dir / ".." / "cache"
        ]
        for d in dirs:
            d.mkdir(parents=True, exist_ok=True)

        # Inicializar archivos si no existen
        if not self.tasks_file.exists():
            self._write_json(self.tasks_file, {"tasks": [], "members": [], "metadata": {
                "project_name": project_name,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "version": "3.0.0"
            }})

        if not self.config_file.exists():
            self._write_json(self.config_file, {
                "standards": {},
                "tools": {},
                "deploy_targets": []
            })

        if not self.broadcast_file.exists():
            self.broadcast_file.write_text("")

        if not self.metrics_file.exists():
            self._write_json(self.metrics_file, {
                "total_tasks": 0,
                "completed_tasks": 0,
                "blocked_tasks": 0,
                "sprint_start": None,
                "sprint_end": None
            })

        # Crear buzones vacíos para cada rol
        roles = ["architect", "frontend", "backend", "database", "devops", 
                 "security", "qa", "marketer", "researcher"]
        for role in roles:
            (self.mailbox_dir / f"{role}.msg").touch()

        logger.info(f"✓ Equipo '{project_name}' inicializado correctamente")
        return True

    def assign_task(self, title: str, assigned_to: str, 
                    description: str = "", priority: str = "MEDIUM",
                    deps: list = None, reviewer: str = None,
                    estimated_hours: int = None, tags: list = None):
        """Asigna una nueva tarea con soporte completo."""
        data = self._read_json(self.tasks_file)
        task_id = len(data["tasks"]) + 1
        
        task = {
            "id": task_id,
            "title": title,
            "description": description,
            "status": "PENDING",
            "priority": priority.upper(),
            "assigned_to": assigned_to,
            "reviewer": reviewer,
            "dependencies": deps or [],
            "estimated_hours": estimated_hours,
            "actual_hours": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "started_at": None,
            "completed_at": None,
            "plan": {"submitted": False, "approved": False, "feedback": None},
            "artifacts": [],
            "tags": tags or []
        }

        data["tasks"].append(task)
        self._write_json(self.tasks_file, data)
        
        self._log_activity(assigned_to, f"Task #{task_id} assigned: {title}")
        logger.info(f"✓ Tarea #{task_id} ({title}) asignada a {assigned_to}")
        return task_id

    def submit_plan(self, task_id: int, agent: str, plan: dict):
        """Envía un plan de acción para aprobación."""
        plan_file = self.plans_dir / f"{task_id}.plan.json"
        plan_data = {
            "task_id": task_id,
            "agent": agent,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "status": "PENDING",
            **plan
        }
        self._write_json(plan_file, plan_data)

        # Actualizar tarea
        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["plan"]["submitted"] = True
                task["status"] = "PLANNING"
                break
        self._write_json(self.tasks_file, data)

        self._log_activity(agent, f"Plan submitted for Task #{task_id}")
        logger.info(f"✓ Plan para tarea #{task_id} enviado por {agent}")

    def approve_plan(self, task_id: int, feedback: str = None):
        """Aprueba un plan de acción."""
        plan_file = self.plans_dir / f"{task_id}.plan.json"
        if plan_file.exists():
            plan = self._read_json(plan_file)
            plan["status"] = "APPROVED"
            plan["approved_at"] = datetime.now(timezone.utc).isoformat()
            plan["feedback"] = feedback
            self._write_json(plan_file, plan)

        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["plan"]["approved"] = True
                task["plan"]["feedback"] = feedback
                task["status"] = "APPROVED"
                break
        self._write_json(self.tasks_file, data)

        self._log_activity("alejabot", f"Plan approved for Task #{task_id}")
        logger.info(f"✓ Plan para tarea #{task_id} aprobado")

    def reject_plan(self, task_id: int, feedback: str):
        """Rechaza un plan con feedback."""
        plan_file = self.plans_dir / f"{task_id}.plan.json"
        if plan_file.exists():
            plan = self._read_json(plan_file)
            plan["status"] = "REJECTED"
            plan["feedback"] = feedback
            self._write_json(plan_file, plan)

        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["plan"]["approved"] = False
                task["plan"]["feedback"] = feedback
                task["status"] = "PENDING"
                break
        self._write_json(self.tasks_file, data)

        self._log_activity("alejabot", f"Plan rejected for Task #{task_id}: {feedback}")
        logger.info(f"✗ Plan para tarea #{task_id} rechazado")

    def start_task(self, task_id: int, agent: str):
        """Inicia la ejecución de una tarea."""
        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                # Verificar dependencias
                for dep_id in task["dependencies"]:
                    dep_task = next((t for t in data["tasks"] if t["id"] == dep_id), None)
                    if dep_task and dep_task["status"] != "COMPLETED":
                        logger.error(f"✗ Dependencia #{dep_id} no completada")
                        return False
                
                task["status"] = "IN_PROGRESS"
                task["started_at"] = datetime.now(timezone.utc).isoformat()
                break
        self._write_json(self.tasks_file, data)

        self._log_activity(agent, f"Task #{task_id} started")
        logger.info(f"▶ Tarea #{task_id} iniciada por {agent}")

    def complete_task(self, task_id: int, agent: str, artifacts: list = None):
        """Marca una tarea como completada y envía a revisión."""
        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["status"] = "REVIEW"
                task["completed_at"] = datetime.now(timezone.utc).isoformat()
                if artifacts:
                    task["artifacts"].extend(artifacts)
                break
        self._write_json(self.tasks_file, data)

        self._log_activity(agent, f"Task #{task_id} completed, submitted for review")
        logger.info(f"✓ Tarea #{task_id} completada, en revisión")

    def approve_review(self, task_id: int, reviewer: str):
        """Aprueba una revisión."""
        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["status"] = "COMPLETED"
                break
        self._write_json(self.tasks_file, data)

        # Actualizar métricas
        self._update_metrics()

        self._log_activity(reviewer, f"Review approved for Task #{task_id}")
        logger.info(f"✅ Tarea #{task_id} aprobada y completada")

    def request_changes(self, task_id: int, reviewer: str, feedback: str):
        """Solicita cambios en una revisión."""
        data = self._read_json(self.tasks_file)
        for task in data["tasks"]:
            if task["id"] == task_id:
                task["status"] = "IN_PROGRESS"
                task["plan"]["feedback"] = feedback
                break
        self._write_json(self.tasks_file, data)

        self._log_activity(reviewer, f"Changes requested for Task #{task_id}: {feedback}")
        logger.info(f"🔄 Cambios solicitados para tarea #{task_id}")

    def acquire_lock(self, filename: str, agent: str, task_id: int):
        """Adquiere un lock sobre un archivo."""
        lock_file = self.locks_dir / f"{filename}.lock"
        if lock_file.exists():
            logger.warning(f"⚠ Lock ya existe para {filename}")
            return False

        lock_data = {
            "file": filename,
            "locked_by": agent,
            "locked_at": datetime.now(timezone.utc).isoformat(),
            "task_id": task_id
        }
        self._write_json(lock_file, lock_data)
        self._log_activity(agent, f"Lock acquired: {filename}")
        return True

    def release_lock(self, filename: str, agent: str):
        """Libera un lock sobre un archivo."""
        lock_file = self.locks_dir / f"{filename}.lock"
        if lock_file.exists():
            lock_file.unlink()
            self._log_activity(agent, f"Lock released: {filename}")
            logger.info(f"🔓 Lock liberado: {filename}")
            return True
        return False

    def broadcast(self, sender: str, message: str, targets: list = None):
        """Envía un mensaje broadcast a todo el equipo."""
        msg = {
            "id": f"bcast-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
            "from": sender,
            "type": "BROADCAST",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "message": message,
            "targets": targets or ["all"],
            "acknowledged_by": []
        }
        with open(self.broadcast_file, 'a') as f:
            f.write(json.dumps(msg) + "\n")

        self._log_activity(sender, f"Broadcast: {message[:50]}...")
        logger.info(f"📢 Broadcast enviado por {sender}")

    def send_message(self, sender: str, receiver: str, message: str, 
                     priority: str = "MEDIUM", requires_response: bool = False):
        """Envía un mensaje directo a un agente."""
        msg = {
            "id": f"msg-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
            "from": sender,
            "to": receiver,
            "type": "DIRECT",
            "priority": priority.upper(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "message": message,
            "requires_response": requires_response,
            "read": False
        }
        mailbox_file = self.mailbox_dir / f"{receiver}.msg"
        with open(mailbox_file, 'a') as f:
            f.write(json.dumps(msg) + "\n")

        self._log_activity(sender, f"Message to {receiver}: {message[:50]}...")
        logger.info(f"✉️ Mensaje enviado a {receiver}")

    def get_status(self):
        """Obtiene el estado actual del proyecto."""
        data = self._read_json(self.tasks_file)
        tasks = data.get("tasks", [])
        
        status = {
            "total": len(tasks),
            "pending": len([t for t in tasks if t["status"] == "PENDING"]),
            "in_progress": len([t for t in tasks if t["status"] == "IN_PROGRESS"]),
            "review": len([t for t in tasks if t["status"] == "REVIEW"]),
            "completed": len([t for t in tasks if t["status"] == "COMPLETED"]),
            "blocked": len([t for t in tasks if t["status"] == "BLOCKED"])
        }
        return status

    def _update_metrics(self):
        """Actualiza las métricas del proyecto."""
        data = self._read_json(self.tasks_file)
        tasks = data.get("tasks", [])
        
        metrics = {
            "total_tasks": len(tasks),
            "completed_tasks": len([t for t in tasks if t["status"] == "COMPLETED"]),
            "blocked_tasks": len([t for t in tasks if t["status"] == "BLOCKED"]),
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
        self._write_json(self.metrics_file, metrics)

    def _log_activity(self, agent: str, action: str):
        """Registra actividad en el log."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] [{agent}] {action}\n"
        with open(LOG_FILE, 'a') as f:
            f.write(log_entry)

    def _read_json(self, path: Path):
        """Lee un archivo JSON."""
        with open(path, 'r') as f:
            return json.load(f)

    def _write_json(self, path: Path, data: dict):
        """Escribe un archivo JSON."""
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)


# CLI Interface
if __name__ == "__main__":
    tm = TeamManager()
    
    if len(sys.argv) < 2:
        print("Uso: python team_manager.py <command> [args]")
        print("Comandos: init, assign, status, broadcast, message")
        sys.exit(1)

    cmd = sys.argv[1]
    
    if cmd == "init":
        project = sys.argv[2] if len(sys.argv) > 2 else "Untitled"
        tm.init_team(project)
    elif cmd == "status":
        print(json.dumps(tm.get_status(), indent=2))
    elif cmd == "broadcast":
        sender = sys.argv[2]
        message = " ".join(sys.argv[3:])
        tm.broadcast(sender, message)
    else:
        print(f"Comando desconocido: {cmd}")
        sys.exit(1)
```

---

## 📖 Guía de Uso

### 1. Inicialización

```bash
# Inicializar el equipo
python team_manager.py init "Mi Proyecto"

# O pedir a Alejabot:
# "Usa la habilidad Equipo Alejabot para inicializar este proyecto"
```

### 2. Asignación de Tareas

```bash
# Asignar tarea
python team_manager.py assign "Implementar login" backend --priority HIGH

# Ver estado
python team_manager.py status
```

### 3. Flujo de Trabajo del Agente

```
1. Revisar mailbox → .antigravity/team/mailbox/{mi_rol}.msg
2. Ver tareas asignadas → tasks.json
3. Si requiere planificación:
   a. Crear plan → .antigravity/team/plans/{task_id}.plan.json
   b. Esperar aprobación de Alejabot
4. Adquirir lock → .antigravity/team/locks/{archivo}.lock
5. Implementar solución
6. Liberar lock
7. Marcar tarea como REVIEW
8. Esperar aprobación del reviewer
```

### 4. Comandos Rápidos para Agentes

| Acción | Comando |
|--------|---------|
| Ver mis tareas | `cat tasks.json \| jq '.tasks[] \| select(.assigned_to == "mi_rol")'` |
| Ver mensajes | `cat mailbox/mi_rol.msg` |
| Crear lock | `python team_manager.py lock archivo.ts mi_rol 1` |
| Liberar lock | `python team_manager.py unlock archivo.ts mi_rol` |
| Enviar plan | `python team_manager.py plan 1 mi_rol plan.json` |

---

## ⚠️ Reglas Críticas

1. **NUNCA** editar un archivo si existe un `.lock` activo
2. **NUNCA** saltarse el proceso de aprobación de planes
3. **NUNCA** commitear sin revisión de seguridad
4. **SIEMPRE** liberar locks al completar
5. **SIEMPRE** notificar al Director al completar tareas
6. **SIEMPRE** seguir los estándares definidos en `standards.json`
7. **SIEMPRE** incluir tests para nuevo código
8. **SIEMPRE** documentar cambios significativos

---

## 🆘 Resolución de Problemas

### Tarea Bloqueada
1. Identificar dependencia bloqueante
2. Notificar al Director
3. Director reasigna o reprioriza

### Conflicto de Locks
1. Verificar `.antigravity/team/locks/`
2. Si lock huérfano (>4h), Director puede liberar
3. Notificar al agente original

### Plan Rechazado
1. Revisar feedback del Director
2. Modificar plan según indicaciones
3. Reenviar para aprobación

---

> **Creado para la comunidad de Alejavi por academIArtificial**  
> **Versión 3.0.0 - Enterprise Edition**  
> *Un equipo bien coordinado es imparable.*
