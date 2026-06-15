# SmartAtSys API — Frontend Integration Guide

Base URL (development): `http://localhost:4000`

Related docs:
- Environment setup: [ENV.md](./ENV.md)
- Database schema: [../sql/schema.sql](../sql/schema.sql)
- Demo data: [../sql/seed.sql](../sql/seed.sql)
- Auth migration (existing DBs): [../sql/migrate_auth.sql](../sql/migrate_auth.sql)
- Postman collection: [SmartAtSys.postman_collection.json](./SmartAtSys.postman_collection.json)

---

## Quick start

1. Backend team applies `schema.sql` then `seed.sql` on Fabric Warehouse (or `migrate_auth.sql` + re-seed on existing DB).
2. Backend runs `npm run dev` on port 4000.
3. Frontend (Next.js SAMS) runs on `http://localhost:3000` — backend `CORS_ORIGIN` defaults to this port.
4. Import Postman collection and test login before wiring UI.

---

## Authentication

Login uses **email + password** (matches SAMS login screen).

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "password123"
}
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
      "email": "student@university.edu",
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

Use on app load to restore session and route by `data.role`:
- `student` → `/student`
- `faculty` → `/faculty`
- `admin` → `/admin`

---

## Demo credentials (after seed.sql)

Password for all accounts: **`password123`**

| Role | Email | userId |
|------|-------|--------|
| Student (72% demo, below threshold) | `student@university.edu` | 101 |
| Student (healthy) | `student2@university.edu` | 102 |
| Faculty | `faculty@university.edu` | 1 |
| Admin | `admin@university.edu` | 2 |

Set `ADMIN_FACULTY_IDS=2` in backend `.env` for admin login.

---

## Dashboard endpoints (SAMS UI)

### Student dashboard — single payload

```http
GET /api/dashboard/student
Authorization: Bearer <student-token>
```

Faculty/admin may pass `?studentId=101`.

```json
{
  "success": true,
  "data": {
    "summary": {
      "attendancePercentage": 72,
      "threshold": 75,
      "isBelowThreshold": true,
      "present": 18,
      "absent": 7,
      "totalClasses": 25
    },
    "history": [
      {
        "attendanceId": 25,
        "date": "2026-03-11",
        "subject": "Data Structures",
        "status": "Present"
      }
    ],
    "prediction": {
      "status": "At Risk",
      "riskScore": 85,
      "predictedAttendance": 68
    }
  }
}
```

### Admin dashboard — summary cards

```http
GET /api/dashboard/admin
Authorization: Bearer <admin-token>
```

```json
{
  "success": true,
  "data": {
    "totalStudents": 2,
    "attendanceAverage": 82,
    "riskStudentsCount": 1,
    "threshold": 75
  }
}
```

Power BI section: call `GET /api/powerbi/embed` separately for `reportUrl`.

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

## Endpoints

All routes below except `GET /health` and `POST /api/auth/login` require `Authorization: Bearer <token>`.

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Server alive check |

### Auth

| Method | Path | Auth | Body | Roles |
|--------|------|------|------|-------|
| POST | `/api/auth/login` | None | `{ email, password }` | Public |
| GET | `/api/auth/me` | Bearer | — | All |

### Dashboard

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/dashboard/student` | Bearer | student, faculty, admin |
| GET | `/api/dashboard/admin` | Bearer | admin |

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

### Classes

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/classes/:id/students` | Bearer | faculty, admin |

Returns roster for marking attendance:

```json
{
  "success": true,
  "data": [
    { "studentId": 101, "studentName": "John Doe", "rollNo": "CS2024001" }
  ]
}
```

### Attendance

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/attendance/mark` | Bearer | faculty, admin |
| POST | `/api/attendance/mark-bulk` | Bearer | faculty, admin |
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

**Mark bulk (full class session)**

```json
{
  "classId": 1,
  "attendanceDate": "2026-06-12",
  "records": [
    { "studentId": 101, "status": "Present" },
    { "studentId": 102, "status": "Absent" }
  ]
}
```

`status` must be `"Present"` or `"Absent"`.  
`attendanceDate` format: `YYYY-MM-DD`.

Attendance list responses include `subject` (from Classes join):

```json
{
  "attendanceId": 1,
  "date": "2026-03-05",
  "classId": 1,
  "status": "Absent",
  "studentId": 101,
  "subject": "Data Structures"
}
```

### Analytics

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/analytics/student/:id` | Bearer | self, faculty, admin |
| GET | `/api/analytics/class/:id` | Bearer | faculty, admin |
| GET | `/api/analytics/department/:dept` | Bearer | faculty, admin |

### Predictions (AI)

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/predictions/student/:id` | Bearer | self, faculty, admin |
| GET | `/api/predictions/all-risk` | Bearer | faculty, admin |

### Notifications

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/notifications/:studentId` | Bearer | self, faculty, admin |
| POST | `/api/notifications/create` | Bearer | admin |

### Power BI (demo — link only, no Azure)

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/powerbi/embed` | Bearer | faculty, admin |

Set `POWERBI_DASHBOARD_URL` in backend `.env`. Frontend opens `data.reportUrl` in a new tab.

---

## Role matrix — SAMS screens

| Screen | Primary API |
|--------|-------------|
| Login | `POST /api/auth/login` |
| Session restore | `GET /api/auth/me` |
| Student dashboard | `GET /api/dashboard/student` |
| Admin dashboard cards | `GET /api/dashboard/admin` |
| Admin Power BI | `GET /api/powerbi/embed` |
| Faculty — pick class | `GET /api/faculty/:id/classes` |
| Faculty — student roster | `GET /api/classes/:id/students` |
| Faculty — save attendance | `POST /api/attendance/mark-bulk` |

---

## Frontend implementation notes

**Suggested env (Next.js frontend)**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**CORS**

Backend allows origin from `CORS_ORIGIN` (default `http://localhost:3000`).

---

## Integration checklist

### Backend team

- [ ] Run `schema.sql` then `seed.sql` (or `migrate_auth.sql` on existing DB, then re-seed)
- [ ] Set `JWT_SECRET`, `ADMIN_FACULTY_IDS=2`, `CORS_ORIGIN=http://localhost:3000`
- [ ] `npm run check:env` and `npm run dev` — `GET /health` returns 200
- [ ] Postman: student login + `GET /api/dashboard/student` succeed

### Frontend team

- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:4000`
- [ ] Login with email/password → store JWT → attach Bearer header
- [ ] Route by `user.role` after login
- [ ] Student page: `GET /api/dashboard/student`
- [ ] Admin page: `GET /api/dashboard/admin` + `GET /api/powerbi/embed`
- [ ] Faculty page: classes → roster → `POST /api/attendance/mark-bulk`

---

## Database setup

1. Execute [../sql/schema.sql](../sql/schema.sql)
2. Execute [../sql/seed.sql](../sql/seed.sql)

For databases created before auth columns:

3. Execute [../sql/migrate_auth.sql](../sql/migrate_auth.sql)
4. Re-run [../sql/seed.sql](../sql/seed.sql)

```powershell
cd backend
npm install
npm run check:env
npm run dev
```
