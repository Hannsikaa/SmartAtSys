export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  STUDENT: "/student",
  FACULTY: "/faculty",
  ADMIN: "/admin",
} as const;

export const ROLE_ROUTES: Record<Role, string> = {
  [ROLES.STUDENT]: ROUTES.STUDENT,
  [ROLES.FACULTY]: ROUTES.FACULTY,
  [ROLES.ADMIN]: ROUTES.ADMIN,
};

export const ATTENDANCE_THRESHOLD = 75;

export const POWER_BI_EMBED_URL =
  "https://app.fabric.microsoft.com/reportEmbed?reportId=68572cce-1cdb-4946-ba64-732f7d7a3781&autoAuth=true&ctid=8d7dd5c1-a94d-4ae3-abe0-b5f24a39b62c";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const CLASSES = [
  { id: "CSE-A", name: "CSE-A" },
  { id: "CSE-B", name: "CSE-B" },
  { id: "ECE-A", name: "ECE-A" },
  { id: "MECH-A", name: "MECH-A" },
];

export const SUBJECTS = [
  { id: "AI", name: "Artificial Intelligence" },
  { id: "Cloud", name: "Cloud Computing" },
  { id: "DBMS", name: "Database Management" },
  { id: "Networks", name: "Computer Networks" },
];
