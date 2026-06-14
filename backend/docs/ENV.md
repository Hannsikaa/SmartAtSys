# Environment Configuration Guide

Copy [`.env.example`](../.env.example) to `.env` and fill in values. Never commit `.env` to git.

**Frontend integration:** See [API.md](./API.md) for endpoints, auth flow, and demo credentials. Apply [../sql/schema.sql](../sql/schema.sql) then [../sql/seed.sql](../sql/seed.sql) on the warehouse before testing. Import [SmartAtSys.postman_collection.json](./SmartAtSys.postman_collection.json) to verify APIs.

## Quick reference

| Priority | Variables | Who provides |
|----------|-----------|--------------|
| **Required to start** | `JWT_SECRET`, `FABRIC_WAREHOUSE_SERVER`, `FABRIC_WAREHOUSE_DATABASE`, `FABRIC_WAREHOUSE_USER`, `FABRIC_WAREHOUSE_PASSWORD` | You + DB/Fabric team |
| **Required for Power BI embed** | `POWERBI_WORKSPACE_ID`, `POWERBI_REPORT_ID`, `POWERBI_CLIENT_ID`, `POWERBI_CLIENT_SECRET`, `POWERBI_TENANT_ID` | Power BI team + Azure admin |
| **You set** | `JWT_SECRET`, `ADMIN_FACULTY_IDS`, `CORS_ORIGIN` | You |
| **Safe defaults** | `PORT`, `FABRIC_WAREHOUSE_ENCRYPT`, `FABRIC_WAREHOUSE_TRUST_SERVER_CERT`, `POWERBI_EMBED_URL`, rate limits, `LOG_LEVEL` | Leave as-is |
| **Optional / unused by code** | `FABRIC_WORKSPACE_ID`, `POWERBI_DASHBOARD_URL` | Teammates (reference only) |

You can test **auth, attendance, analytics, AI, and notifications** without any Power BI variables. Power BI link mode only needs `POWERBI_DASHBOARD_URL` (no Azure).

**Azure embed is skipped for now.** When IT provides credentials later, set `POWERBI_CLIENT_ID`, `POWERBI_CLIENT_SECRET`, and `POWERBI_TENANT_ID` for in-app embed.

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
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend runs on a different URL |
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

## Power BI configuration

### Display values (from Power BI team)

| Variable | Purpose |
|----------|---------|
| `POWERBI_DASHBOARD_URL` | Browser link to dashboard (informational) |
| `POWERBI_EMBED_URL` | Base embed URL returned to frontend |
| `POWERBI_WORKSPACE_ID` | Workspace GUID — required for embed token API |
| `POWERBI_REPORT_ID` | Report GUID — required for embed token API |

### Azure credentials (from deployment / Azure admin)

| Variable | Purpose |
|----------|---------|
| `POWERBI_CLIENT_ID` | Azure AD app (service principal) ID |
| `POWERBI_CLIENT_SECRET` | App secret |
| `POWERBI_TENANT_ID` | Azure AD tenant GUID |

Used by [`src/services/powerbi.service.ts`](../src/services/powerbi.service.ts) to obtain an Azure AD token and call Power BI `GenerateToken`.

Ask the Azure admin: *"Service principal credentials for Power BI embed — Client ID, Client Secret, Tenant ID, with access to our workspace and report."*

`POWERBI_WORKSPACE_ID` and `FABRIC_WORKSPACE_ID` are often the **same GUID**, but only `POWERBI_WORKSPACE_ID` is used by backend code.

---

## What to ask each teammate

### DB / Fabric team
- Warehouse server name
- Database name
- Username and password (SQL auth)
- Confirm tables exist: `Students`, `Faculty`, `Classes`, `Attendance`, `Notifications`

### Power BI team
- Workspace ID (GUID)
- Report ID (GUID)
- Dashboard URL (optional)

### Deployment / Azure admin
- Tenant ID
- Client ID + Client Secret
- Service principal access to Power BI workspace

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
CORS_ORIGIN=http://localhost:5173

JWT_SECRET=your-own-secret-min-8-chars
JWT_EXPIRES_IN=8h

FABRIC_WAREHOUSE_SERVER=<from DB team>
FABRIC_WAREHOUSE_DATABASE=<from DB team>
FABRIC_WAREHOUSE_USER=<from DB team>
FABRIC_WAREHOUSE_PASSWORD=<from DB team>
FABRIC_WAREHOUSE_ENCRYPT=true
FABRIC_WAREHOUSE_TRUST_SERVER_CERT=false

ADMIN_FACULTY_IDS=1
LOG_LEVEL=info
```

---

## Full `.env` when Power BI is ready

Add after Azure admin delivers credentials:

```env
POWERBI_DASHBOARD_URL=https://app.powerbi.com/groups/{workspaceId}/dashboards/{dashboardId}
POWERBI_EMBED_URL=https://app.powerbi.com/reportEmbed
POWERBI_WORKSPACE_ID=<from Power BI team>
POWERBI_REPORT_ID=<from Power BI team>
POWERBI_CLIENT_ID=<from Azure admin>
POWERBI_CLIENT_SECRET=<from Azure admin>
POWERBI_TENANT_ID=<from Azure admin>
```

---

## Checklist

**Before `npm run dev` works:**
- [ ] `JWT_SECRET` — you
- [ ] `FABRIC_WAREHOUSE_SERVER` — DB team
- [ ] `FABRIC_WAREHOUSE_DATABASE` — DB team
- [ ] `FABRIC_WAREHOUSE_USER` — DB team
- [ ] `FABRIC_WAREHOUSE_PASSWORD` — DB team

**For Power BI embed API:**
- [ ] `POWERBI_WORKSPACE_ID` — Power BI team
- [ ] `POWERBI_REPORT_ID` — Power BI team
- [ ] `POWERBI_CLIENT_ID` — Azure admin
- [ ] `POWERBI_CLIENT_SECRET` — Azure admin
- [ ] `POWERBI_TENANT_ID` — Azure admin

**Can leave as defaults:**
- `FABRIC_WAREHOUSE_ENCRYPT=true`
- `FABRIC_WAREHOUSE_TRUST_SERVER_CERT=false`
- `POWERBI_EMBED_URL=https://app.powerbi.com/reportEmbed`

---

## Database and API handoff

1. Run [../sql/schema.sql](../sql/schema.sql) on Fabric Warehouse.
2. Run [../sql/seed.sql](../sql/seed.sql) for demo data and login credentials.
3. Start server: `npm run dev`
4. Share [API.md](./API.md) and [SmartAtSys.postman_collection.json](./SmartAtSys.postman_collection.json) with the frontend team.
