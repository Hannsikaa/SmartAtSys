"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { getDashboardRoute, saveAuth } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import Button from "@/components/Button";
import { LogoIcon } from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, role } = await login(email, password);
      saveAuth(token, role);
      router.push(getDashboardRoute(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <LogoIcon className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              SAMS
            </span>
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@university.edu"
                className="input"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
            Demo: use admin@, faculty@, or student@ in email to test roles
          </p>
        </form>

        <p className="text-center text-sm text-slate-500">
          <Link
            href={ROUTES.HOME}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
