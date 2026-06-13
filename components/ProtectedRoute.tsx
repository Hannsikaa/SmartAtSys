"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/lib/auth";
import { ROUTES, type Role } from "@/lib/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: Role;
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (!token || !role) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (role !== allowedRole) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setAuthorized(true);
  }, [allowedRole, router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
