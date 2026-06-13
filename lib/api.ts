import { API_BASE_URL, USE_MOCK_API } from "./constants";
import { getToken } from "./auth";
import type { Role } from "./constants";

export interface LoginResponse {
  token: string;
  role: Role;
}

export interface StudentStats {
  attendancePercent: number;
  presentCount: number;
  absentCount: number;
  totalClasses: number;
}

export interface AttendanceRecord {
  date: string;
  subject: string;
  status: "Present" | "Absent";
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
}

export interface MarkAttendancePayload {
  classId: string;
  subjectId: string;
  date: string;
  records: { studentId: string; status: "Present" | "Absent" }[];
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message || `Request failed: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

function inferRoleFromEmail(email: string): Role {
  const lower = email.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("faculty") || lower.includes("teacher")) return "faculty";
  return "student";
}

const mockStats: StudentStats = {
  attendancePercent: 72,
  presentCount: 18,
  absentCount: 7,
  totalClasses: 25,
};

const mockAttendance: AttendanceRecord[] = [
  { date: "10-Jun", subject: "AI", status: "Present" },
  { date: "11-Jun", subject: "Cloud", status: "Absent" },
  { date: "12-Jun", subject: "DBMS", status: "Present" },
  { date: "13-Jun", subject: "Networks", status: "Present" },
  { date: "14-Jun", subject: "AI", status: "Absent" },
];

const mockStudents: Student[] = [
  { id: "101", name: "Alice Johnson", rollNo: "101" },
  { id: "102", name: "Bob Smith", rollNo: "102" },
  { id: "103", name: "Carol Davis", rollNo: "103" },
  { id: "104", name: "David Wilson", rollNo: "104" },
  { id: "105", name: "Eva Martinez", rollNo: "105" },
];

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    return {
      token: `mock-jwt-${Date.now()}`,
      role: inferRoleFromEmail(email),
    };
  }

  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getStudentStats(): Promise<StudentStats> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, 300));
    return mockStats;
  }
  return apiFetch<StudentStats>("/api/student/stats");
}

export async function getStudentAttendance(): Promise<AttendanceRecord[]> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, 300));
    return mockAttendance;
  }
  return apiFetch<AttendanceRecord[]>("/api/student/attendance");
}

export async function getStudents(classId: string): Promise<Student[]> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, 300));
    return mockStudents;
  }
  return apiFetch<Student[]>(`/api/students?classId=${encodeURIComponent(classId)}`);
}

export async function markAttendance(
  payload: MarkAttendancePayload
): Promise<{ success: boolean }> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
  }
  return apiFetch<{ success: boolean }>("/api/attendance/mark", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
