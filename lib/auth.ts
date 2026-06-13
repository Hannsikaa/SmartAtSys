import { ROLE_ROUTES, ROLES, type Role } from "./constants";

const TOKEN_KEY = "sams_token";
const ROLE_KEY = "sams_role";

export function saveAuth(token: string, role: Role): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem(ROLE_KEY);
  if (role === ROLES.STUDENT || role === ROLES.FACULTY || role === ROLES.ADMIN) {
    return role;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getDashboardRoute(role: Role): string {
  return ROLE_ROUTES[role];
}

export function isValidRole(value: string): value is Role {
  return value === ROLES.STUDENT || value === ROLES.FACULTY || value === ROLES.ADMIN;
}
