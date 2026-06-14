# SmartAtSys API — Frontend Integration Guide

Base URL (development): `http://localhost:4000`

Related docs:
- Environment setup: [ENV.md](./ENV.md)
- Database schema: [../sql/schema.sql](../sql/schema.sql)
- Demo data: [../sql/seed.sql](../sql/seed.sql)
- Postman collection: [SmartAtSys.postman_collection.json](./SmartAtSys.postman_collection.json)

---

## Quick start

1. Backend team applies `schema.sql` then `seed.sql` on Fabric Warehouse.
2. Backend runs `npm run dev` on port 4000.
3. Frontend runs on `http://localhost:5173` (or update backend `CORS_ORIGIN` in `.env`).
4. Import Postman collection and test login before building UI.

---

## Authentication

No password in the current schema. Login uses **roll number** (students) or **faculty ID** (faculty/admin).

### Login — student

```http
POST /api/auth/login
Content-Type: application/json

{
  "role": "student",
  "rollNo": "CS2024001"
}
```

### Login — faculty

```http
POST /api/auth/login
Content-Type: application/json

{
  "role": "faculty",
  "facultyId": 1
}
```

### Login — admin

Same as faculty but with `"role": "admin"`. Faculty ID must be listed in backend `ADMIN_FACULTY_IDS` (default seed: faculty `1`).

```json
{ "role": "admin", "facultyId": 1 }
```

### Login response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": 101,
      "role": "student",
      "name": "John Doe",
      "department": "Computer Science",
      "rollNo": "CS2024001"
    }
  }
}
```

Store `data.token` (e.g. `localStorage`). Send on every protected request:

```http
Authorization: Bearer <token>
```

### Current user

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Use on app load to restore session and route by `data.role` (`student` | `faculty` | `admin`).

---

## Response format

**Success**

```json
{ "success": true, "data": { ... } }
```

**Error**

```json
{ "success": false, "message": "Human-readable error" }
```

| HTTP status | Meaning |
|-------------|---------|
| 400 | Validation error (bad request body) |
| 401 | Missing/invalid token or login failed |
| 403 | Valid token but wrong role |
| 404 | Resource not found |
| 409 | Conflict |
| 429 | Rate limited (login: 20 req / 15 min) |
| 500 | Server error |

---

## Demo credentials (after seed.sql)

| Role | Login body |
|------|------------|
| Student (at-risk demo) | `{ "role": "student", "rollNo": "CS2024001" }` → userId `101` |
| Student (healthy) | `{ "role": "student", "rollNo": "CS2024002" }` → userId `102` |
| Faculty | `{ "role": "faculty", "facultyId": 1 }` |
| Admin | `{ "role": "admin", "facultyId": 1 }` |

Demo IDs: Class `1`, Faculty `1`, Students `101` / `102`.

---

## Endpoints

All routes below except `GET /health` and `POST /api/auth/login` require `Authorization: Bearer <token>`.

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Server alive check |

### Auth

| Method | Path | Auth | Body | Roles |
|--------|------|------|------|-------|
| POST | `/api/auth/login` | None | See above | Public |
| GET | `/api/auth/me` | Bearer | — | All |

### Students

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/students` | Bearer | faculty, admin |
| GET | `/api/students/:id` | Bearer | self (student), faculty, admin |

### Faculty

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/faculty/:id` | Bearer | faculty, admin |
| GET | `/api/faculty/:id/classes` | Bearer | faculty, admin |

### Attendance

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/attendance/mark` | Bearer | faculty, admin |
| PUT | `/api/attendance/:id` | Bearer | faculty, admin |
| GET | `/api/attendance/student/:id` | Bearer | self, faculty, admin |
| GET | `/api/attendance/class/:id` | Bearer | faculty, admin |

**Mark attendance**

```http
POST /api/attendance/mark
Authorization: Bearer <faculty-token>
Content-Type: application/json

{
  "studentId": 101,
  "classId": 1,
  "attendanceDate": "2026-03-10",
  "status": "Absent"
}
```

`status` must be `"Present"` or `"Absent"`.  
`attendanceDate` format: `YYYY-MM-DD`.

Response includes updated attendance row plus AI prediction and may create a notification.

**Update attendance**

```http
PUT /api/attendance/1
Content-Type: application/json

{ "status": "Present" }
```

### Analytics

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/analytics/student/:id` | Bearer | self, faculty, admin |
| GET | `/api/analytics/class/:id` | Bearer | faculty, admin |
| GET | `/api/analytics/department/:dept` | Bearer | faculty, admin |

**Student analytics response (example)**

```json
{
  "success": true,
  "data": {
    "studentId": 101,
    "studentName": "John Doe",
    "department": "Computer Science",
    "present": 6,
    "absent": 6,
    "total": 12,
    "percentage": 50
  }
}
```

**Class analytics** — returns `subjectName`, `department`, and per-student stats.

**Department analytics** — URL-encode department name, e.g. `/api/analytics/department/Computer%20Science`.

### Predictions (AI)

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/predictions/student/:id` | Bearer | self, faculty, admin |
| GET | `/api/predictions/all-risk` | Bearer | faculty, admin |

**Prediction response (example)**

```json
{
  "success": true,
  "data": {
    "studentId": 101,
    "currentAttendance": 50,
    "predictedAttendance": 42,
    "riskScore": 78,
    "status": "At Risk"
  }
}
```

`status` is `"At Risk"` or `"Safe"`.

### Notifications

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/notifications/:studentId` | Bearer | self, faculty, admin |
| POST | `/api/notifications/create` | Bearer | admin |

**Create notification (admin)**

```json
{
  "studentId": 101,
  "message": "Custom warning message"
}
```

Auto notifications (after mark attendance or nightly job):
- `"Warning: Attendance likely below 75%"`
- `"Safe: Attendance healthy"`

### Power BI (optional — Azure embed skipped for now)

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/powerbi/embed` | Bearer | faculty, admin |

**Link-only mode** (current — no Azure credentials). Set `POWERBI_DASHBOARD_URL` to your Fabric report URL:

```json
{
  "success": true,
  "data": {
    "mode": "link",
    "enabled": false,
    "message": "Azure embed skipped. Open reportUrl in a new browser tab while logged into Microsoft.",
    "reportUrl": "https://app.fabric.microsoft.com/groups/.../reports/...",
    "workspaceId": "...",
    "reportId": "..."
  }
}
```

Frontend: if `data.mode === "link"`, show a button that opens `data.reportUrl` in a new tab.

**Embed mode** (later, when Azure creds exist): `mode: "embed"`, `enabled: true`, includes `accessToken` — use [Power BI JavaScript SDK](https://github.com/microsoft/PowerBI-JavaScript) `embedReport()`.

---

## Role matrix — which screens use which APIs

| Screen | Student | Faculty | Admin |
|--------|---------|---------|-------|
| Login | POST `/api/auth/login` | POST `/api/auth/login` | POST `/api/auth/login` |
| Session restore | GET `/api/auth/me` | GET `/api/auth/me` | GET `/api/auth/me` |
| My attendance | GET `/api/attendance/student/:id` | — | — |
| My analytics | GET `/api/analytics/student/:id` | — | — |
| My risk | GET `/api/predictions/student/:id` | — | — |
| My notifications | GET `/api/notifications/:studentId` | — | — |
| Mark attendance | — | POST `/api/attendance/mark` | POST `/api/attendance/mark` |
| Class list | — | GET `/api/faculty/:id/classes` | GET `/api/faculty/:id/classes` |
| Class analytics | — | GET `/api/analytics/class/:id` | GET `/api/analytics/class/:id` |
| All at-risk | — | GET `/api/predictions/all-risk` | GET `/api/predictions/all-risk` |
| Student list | — | GET `/api/students` | GET `/api/students` |
| Power BI report link | — | GET `/api/powerbi/embed` → open `reportUrl` | GET `/api/powerbi/embed` → open `reportUrl` |

Students use their own `userId` from `/api/auth/me` as `:id` / `:studentId`.

Faculty use their own `userId` as `:id` in `/api/faculty/:id/classes`.

---

## Frontend implementation notes

**Suggested env (frontend)**

```env
VITE_API_URL=http://localhost:4000
```

**Axios example**

```typescript
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Routing**

- After login, read `data.user.role` and redirect:
  - `student` → `/student/dashboard`
  - `faculty` → `/faculty/dashboard`
  - `admin` → `/admin/dashboard` (can reuse faculty views + admin-only actions)

**CORS**

Backend allows origin from `CORS_ORIGIN` (default `http://localhost:5173`). If your dev server uses another port, ask backend team to update `.env`.

---

## Integration checklist

### Backend team (before handoff)

- [ ] Fabric warehouse credentials in `.env`
- [ ] `JWT_SECRET` set (min 8 characters)
- [ ] Run `sql/schema.sql` then `sql/seed.sql` on warehouse
- [ ] `npm run check:env` passes
- [ ] `npm run dev` — `GET /health` returns 200
- [ ] Postman collection: student login + mark attendance succeed

### Frontend team (after receiving this doc)

- [ ] Set `VITE_API_URL=http://localhost:4000`
- [ ] Implement login → store JWT → attach Bearer header
- [ ] Call `GET /api/auth/me` on app load
- [ ] Gate routes by role from `me` response
- [ ] Build student dashboard (analytics, predictions, notifications, attendance)
- [ ] Build faculty dashboard (classes, mark attendance, all-risk list)
- [ ] Confirm CORS port with backend team if not using 5173

---

## Database setup commands

Run in SSMS / Azure Data Studio against Fabric Warehouse:

1. Execute [../sql/schema.sql](../sql/schema.sql)
2. Execute [../sql/seed.sql](../sql/seed.sql)

Then start backend:

```powershell
cd backend
npm install
npm run check:env
npm run dev
```
