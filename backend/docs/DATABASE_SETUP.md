# Database setup — Fabric Warehouse (demo)

Demo uses **SQL username + password only**. No Azure client ID.

## 1. Configure `.env`

```env
FABRIC_WAREHOUSE_SERVER=your-server.datawarehouse.fabric.microsoft.com
FABRIC_WAREHOUSE_DATABASE=SmartAttendanceWarehouse
FABRIC_WAREHOUSE_USER=<from DB team>
FABRIC_WAREHOUSE_PASSWORD=<from DB team>
FABRIC_WAREHOUSE_ENCRYPT=true
FABRIC_WAREHOUSE_TRUST_SERVER_CERT=false
JWT_SECRET=your-secret-min-8-chars
CORS_ORIGIN=http://localhost:3000
ADMIN_FACULTY_IDS=2
```

## 2. Apply schema

**Fabric portal:** Workspace → Warehouse → **New SQL query** → paste [`schema.sql`](../sql/schema.sql) → Run.

**Or SSMS:** Connect with SQL/Entra credentials → run `schema.sql`.

If upgrading an existing database without Email columns, run [`migrate_auth.sql`](../sql/migrate_auth.sql) first.

## 3. Apply seed

Same SQL editor → paste [`seed.sql`](../sql/seed.sql) → Run.

Demo logins (password: `password123`):

| Role | Email |
|------|-------|
| Student | `student@university.edu` |
| Faculty | `faculty@university.edu` |
| Admin | `admin@university.edu` |

## 4. Test

```powershell
npm run test:db
npm run dev
```

## Power BI (demo)

Set `POWERBI_DASHBOARD_URL` to your Fabric report link.  
`GET /api/powerbi/embed` returns `reportUrl` — frontend opens it in a new tab. No Azure.

## Troubleshooting

| Error | Fix |
|-------|-----|
| socket hang up | Check server name, user, password with DB team; try `TRUST_SERVER_CERT=true` only if IT says so |
| Invalid object name Students | Run schema.sql |
| Invalid email or password | Run seed.sql |
| Admin login returns faculty role | Set `ADMIN_FACULTY_IDS=2` in `.env` |
