"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ChartIcon,
  TrendUpIcon,
  UsersIcon,
  WarningIcon,
} from "@/components/Icons";
import { POWER_BI_EMBED_URL, ROLES, ROUTES } from "@/lib/constants";

const sidebarLinks = [
  {
    href: ROUTES.ADMIN,
    label: "Analytics",
    icon: <ChartIcon className="h-4 w-4" />,
  },
];

const adminStats = {
  totalStudents: 248,
  attendanceAverage: "82%",
  riskStudents: 14,
};

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRole={ROLES.ADMIN}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar links={sidebarLinks} />
          <div className="flex flex-1 flex-col bg-slate-50/50">
            <PageHeader
              title="Admin Dashboard"
              description="System-wide attendance analytics powered by Power BI"
              badge="Admin Portal"
            />

            <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total Students"
                  value={adminStats.totalStudents}
                  icon={<UsersIcon className="h-5 w-5" />}
                  variant="default"
                  trend="Enrolled across all classes"
                />
                <StatCard
                  title="Attendance Average"
                  value={adminStats.attendanceAverage}
                  icon={<TrendUpIcon className="h-5 w-5" />}
                  variant="success"
                  trend="Institution-wide average"
                />
                <StatCard
                  title="Risk Students"
                  value={adminStats.riskStudents}
                  subtitle="Below 75% attendance"
                  icon={<WarningIcon className="h-5 w-5" />}
                  variant="danger"
                  trend="Requires attention"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Analytics Overview
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Interactive Power BI dashboard with institutional insights
                    </p>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80 sm:inline-flex">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Live Data
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <ChartIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Power BI Analytics
                        </p>
                        <p className="text-xs text-slate-500">
                          Microsoft Fabric embedded report
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="relative bg-slate-50/50 p-1">
                    <iframe
                      src={POWER_BI_EMBED_URL}
                      width="100%"
                      height="750"
                      className="rounded-xl border-0 bg-white"
                      allowFullScreen
                      title="Power BI Attendance Analytics"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
