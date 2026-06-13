"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { LogoIcon, LogoutIcon } from "./Icons";

interface NavbarProps {
  title?: string;
  variant?: "dashboard" | "landing";
}

export default function Navbar({
  title = "Smart Attendance System",
  variant = "dashboard",
}: NavbarProps) {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push(ROUTES.LOGIN);
  }

  if (variant === "landing") {
    return (
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mt-4 flex h-14 items-center justify-between rounded-2xl glass px-5 shadow-lg shadow-blue-900/5">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
              <LogoIcon className="h-8 w-8" />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                SAMS
              </span>
            </Link>
            <Link href={ROUTES.LOGIN} className="btn btn-primary btn-sm">
              Login
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <LogoIcon className="h-7 w-7" />
          <span className="text-base font-bold tracking-tight text-slate-900">
            {title}
          </span>
        </Link>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogoutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
