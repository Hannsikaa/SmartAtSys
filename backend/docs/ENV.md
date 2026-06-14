# Environment Configuration Guide

Copy [`.env.example`](../.env.example) to `.env` and fill in values. Never commit `.env` to git.

**Frontend integration:** See [API.md](./API.md) for endpoints, auth flow, and demo credentials.  
**Database setup:** See [DATABASE_SETUP.md](./DATABASE_SETUP.md) — apply [../sql/schema.sql](../sql/schema.sql) then [../sql/seed.sql](../sql/seed.sql).

## Quick reference

| Priority | Variables | Who provides |
|----------|-----------|--------------|
| **Required to start** | `JWT_SECRET`, `FABRIC_WAREHOUSE_SERVER`, `FABRIC_WAREHOUSE_DATABASE`, `FABRIC_WAREHOUSE_USER`, `FABRIC_WAREHOUSE_PASSWORD` | You + DB/Fabric team |
| **You set** | `JWT_SECRET`, `ADMIN_FACULTY_IDS`, `CORS_ORIGIN` | You |
| **Safe defaults** | `PORT`, `FABRIC_WAREHOUSE_ENCRYPT`, `FABRIC_WAREHOUSE_TRUST_SERVER_CERT`, rate limits, `LOG_LEVEL` | Leave as-is |

Demo: **no Azure client ID**. Optional `POWERBI_DASHBOARD_URL` opens report in browser.

---

## Required — server will NOT start without these

Validated in [`src/config/env.ts`](../src/config/env.ts):

| Variable | What it is | Who provides |
|----------|------------|--------------|
| `JWT_SECRET` | Signs login tokens | **You** — random string, min 8 characters |
| `FABRIC_WAREHOUSE_SERVER` | SQL endpoint hostname | **DB / Fabric team** |
| `FABRIC_WAREHOUSE_DATABASE` | Warehouse/database name | **DB / Fabric team** |
| `FABRIC_WAREHOUSE_USER` | SQL login username | **DB / Fabric team** |
| `FABRIC_WAREHOUSE_PASSWORD` | SQL login password | **DB / Fabric team** |

Ask the DB team: *"Fabric Warehouse connection details — server, database name, username, password, and auth method (SQL auth)."*

---

## Usually keep as-is (defaults are fine)

| Variable | Default | When to change |
|----------|---------|----------------|
| `PORT` | `4000` | Port 4000 is in use |
| `NODE_ENV` | `development` | Set `production` when deploying |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend runs on a different URL |
| `JWT_EXPIRES_IN` | `8h` | Optional tuning |
| `FABRIC_WAREHOUSE_ENCRYPT` | `true` | **Keep `true`** for Fabric Warehouse |
| `FABRIC_WAREHOUSE_TRUST_SERVER_CERT` | `false` | Set `true` only for local SQL Server dev |
| `POWERBI_EMBED_URL` | `https://app.powerbi.com/reportEmbed` | Do not change unless Microsoft docs say otherwise |
| `RATE_LIMIT_*` | 900000 / 100 | Optional tuning |
| `LOG_LEVEL` | `info` | Use `debug` for troubleshooting |

---

## Optional / metadata

| Variable | Used by backend? | Who provides |
|----------|------------------|--------------|
| `FABRIC_WORKSPACE_ID` | **No** — reference only | Fabric team (optional) |
| `POWERBI_DASHBOARD_URL` | Passed to frontend in embed response | Power BI team |
| `ADMIN_FACULTY_IDS` | Yes — faculty IDs treated as admin | **You** — match seed data |

---

## Power BI (demo — optional)

| Variable | Purpose |
|----------|---------|
| `POWERBI_DASHBOARD_URL` | Fabric report link — frontend opens in new tab |
| `POWERBI_WORKSPACE_ID` | Optional metadata |
| `POWERBI_REPORT_ID` | Optional metadata |

No Azure client ID required. `GET /api/powerbi/embed` returns `reportUrl` only.

---

## What to ask each teammate

### DB / Fabric team
- Warehouse server name
- Database name
- Username and password (SQL auth)
- Confirm tables exist: `Students`, `Faculty`, `Classes`, `Attendance`, `Notifications`

### Power BI team
- Fabric report URL for `POWERBI_DASHBOARD_URL`
- Workspace ID and Report ID (optional)

### You (backend dev)
- `JWT_SECRET`
- `ADMIN_FACULTY_IDS`
- `CORS_ORIGIN` when frontend URL is known

---

## Minimal `.env` for core API testing

Use this when Power BI credentials are not ready yet:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

JWT_SECRET=your-own-secret-min-8-chars
JWT_EXPIRES_IN=8h

FABRIC_WAREHOUSE_SERVER=<from DB team>
FABRIC_WAREHOUSE_DATABASE=<from DB team>
FABRIC_WAREHOUSE_USER=<from DB team>
FABRIC_WAREHOUSE_PASSWORD=<from DB team>
FABRIC_WAREHOUSE_ENCRYPT=true
FABRIC_WAREHOUSE_TRUST_SERVER_CERT=false

ADMIN_FACULTY_IDS=2
LOG_LEVEL=info

# Optional Power BI demo link
POWERBI_DASHBOARD_URL=https://app.fabric.microsoft.com/groups/.../reports/...?experience=power-bi
```

---

## Checklist

**Before `npm run dev` works:**
- [ ] `JWT_SECRET` — you
- [ ] `FABRIC_WAREHOUSE_SERVER` — DB team
- [ ] `FABRIC_WAREHOUSE_DATABASE` — DB team
- [ ] `FABRIC_WAREHOUSE_USER` — DB team
- [ ] `FABRIC_WAREHOUSE_PASSWORD` — DB team

**Optional Power BI demo:**
- [ ] `POWERBI_DASHBOARD_URL` — open report in browser

**Can leave as defaults:**
- `FABRIC_WAREHOUSE_ENCRYPT=true`
- `FABRIC_WAREHOUSE_TRUST_SERVER_CERT=false`

---

## Database and API handoff

1. Run [../sql/schema.sql](../sql/schema.sql) on Fabric Warehouse.
2. Run [../sql/seed.sql](../sql/seed.sql) for demo data and login credentials.
3. Start server: `npm run dev`
4. Share [API.md](./API.md) and [SmartAtSys.postman_collection.json](./SmartAtSys.postman_collection.json) with the frontend team.
