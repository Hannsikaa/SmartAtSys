# SmartAtSys

Smart Attendance Management System — backend API with Fabric Warehouse, heuristic AI risk scoring, and analytics.

## Repo structure

```
SmartAtSys/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # Frontend team (empty — see backend/docs/API.md)
└── README.md
```

## Quick start (backend)

From the **repo root**:

```powershell
copy backend\.env.example backend\.env
# Edit backend\.env: JWT_SECRET + FABRIC_WAREHOUSE_* credentials
npm run install:backend
npm run check:env
npm run dev
```

Or from `backend/` directly: `npm install`, `npm run check:env`, `npm run dev`.

Health check: `GET http://localhost:4000/health`

## Documentation

| Doc | Purpose |
|-----|---------|
| [backend/docs/API.md](backend/docs/API.md) | **Frontend handoff** — endpoints, auth, demo logins |
| [backend/docs/ENV.md](backend/docs/ENV.md) | Environment variables |
| [backend/docs/SmartAtSys.postman_collection.json](backend/docs/SmartAtSys.postman_collection.json) | Postman tests |
| [backend/sql/schema.sql](backend/sql/schema.sql) | Database DDL |
| [backend/sql/seed.sql](backend/sql/seed.sql) | Demo data |

## Database setup (before testing)

1. Run `backend/sql/schema.sql` on Fabric Warehouse
2. Run `backend/sql/seed.sql`
3. Start backend with `npm run dev`

**Demo logins** (after seed):

| Role | Body |
|------|------|
| Student | `{ "role": "student", "rollNo": "CS2024001" }` |
| Faculty | `{ "role": "faculty", "facultyId": 1 }` |

## Power BI — Azure skipped for now

In-app Power BI embed (Azure AD) is **disabled until IT provides credentials**.

For now, set `POWERBI_DASHBOARD_URL` to your Fabric report link.  
`GET /api/powerbi/embed` returns **link-only mode** — frontend opens `reportUrl` in a new tab.

## Remaining work (phased)

### Phase 1 — Testing now (you + DB team)

- [ ] Fabric warehouse credentials in `backend/.env`
- [ ] Apply `schema.sql` + `seed.sql` on warehouse
- [ ] `npm run dev` + Postman collection smoke test
- [ ] Push repo to GitHub (do **not** commit `.env`)

### Phase 2 — Frontend MVP (frontend team)

- [ ] Login (student rollNo / faculty ID)
- [ ] Student dashboard (attendance, analytics, predictions, notifications)
- [ ] Faculty dashboard (mark attendance, at-risk list)
- [ ] Power BI: button → open `reportUrl` from `/api/powerbi/embed`

See [backend/docs/API.md](backend/docs/API.md).

### Phase 3 — Integration hardening

- [ ] End-to-end tests against warehouse
- [ ] CORS aligned with frontend port
- [ ] Error handling / loading states in UI

### Phase 4 — Power BI in-app embed (later)

- [ ] Azure AD app registration (IT admin)
- [ ] Set `POWERBI_CLIENT_ID`, `CLIENT_SECRET`, `TENANT_ID`
- [ ] Frontend uses Power BI JS SDK with embed token

### Phase 5 — Production (deployment team)

- [ ] Hosting, HTTPS, production `.env`
- [ ] CI pipeline
- [ ] Performance validation

## Push to GitHub

```powershell
# From repo root — ensure .env is NOT staged
git add .
git status   # verify .env is not listed
git commit -m "Add SmartAtSys backend with API docs and handoff package"
git push -u origin main
```

**Never commit** `backend/.env` — it contains secrets. Only `.env.example` is tracked.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Compile TypeScript |
| `npm test` | Unit tests (AI/math) |
| `npm run check:env` | Validate `.env` without DB |
