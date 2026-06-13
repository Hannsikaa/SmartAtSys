# Smart Attendance Management System (SAMS)

Role-based SaaS web application for attendance management with Power BI analytics.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Power BI Embed** (Microsoft Fabric)
- **REST APIs** (backend integration ready)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Login

Mock API is enabled by default. Use any password and include the role in your email:

| Email | Role |
|-------|------|
| `student@university.edu` | Student → `/student` |
| `faculty@university.edu` | Faculty → `/faculty` |
| `admin@university.edu` | Admin → `/admin` |

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=false
```

Set `NEXT_PUBLIC_USE_MOCK=false` to connect to the real backend API.

## Project Structure

```
app/
  page.tsx          # Landing page
  login/            # Authentication
  student/          # Student dashboard
  faculty/          # Faculty attendance marking
  admin/            # Power BI analytics
components/         # Reusable UI components
lib/                # Auth, API, constants
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/student/stats` | Student statistics |
| GET | `/api/student/attendance` | Attendance history |
| GET | `/api/students?classId=` | Students by class |
| POST | `/api/attendance/mark` | Submit attendance |
