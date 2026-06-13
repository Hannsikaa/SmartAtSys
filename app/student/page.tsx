"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ChartIcon,
  TrendUpIcon,
  WarningIcon,
} from "@/components/Icons";
import {
  getStudentAttendance,
  getStudentStats,
  type AttendanceRecord,
  type StudentStats,
} from "@/lib/api";
import { ATTENDANCE_THRESHOLD, ROLES, ROUTES } from "@/lib/constants";

const sidebarLinks = [
  { href: ROUTES.STUDENT, label: "Dashboard", icon: <ChartIcon className="h-4 w-4" /> },
];

function StudentDashboardContent() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, attendanceData] = await Promise.all([
          getStudentStats(),
          getStudentAttendance(),
        ]);
        setStats(statsData);
        setAttendance(attendanceData);
      } catch {
        /* handled by empty state */
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isBelowThreshold =
    stats !== null && stats.attendancePercent < ATTENDANCE_THRESHOLD;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50/50">
        <LoadingSpinner label="Loading your dashboard..." />
      </div>
    );
  }

  const percent = stats?.attendancePercent ?? 0;

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader
        title="Student Dashboard"
        description="Your personal attendance overview and history"
        badge="Student Portal"
      />

      <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
        {isBelowThreshold && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50 to-rose-50 p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <WarningIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Attendance Warning</p>
              <p className="mt-1 text-sm leading-relaxed text-red-700/90">
                Your attendance is below {ATTENDANCE_THRESHOLD}% (
                {stats?.attendancePercent}%). Please improve your attendance to
                avoid academic penalties.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="flex flex-col items-center justify-center lg:col-span-1">
            <ProgressRing
              percent={percent}
              threshold={ATTENDANCE_THRESHOLD}
            />
            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant={
                  isBelowThreshold
                    ? "danger"
                    : percent >= ATTENDANCE_THRESHOLD
                      ? "success"
                      : "warning"
                }
                dot
              >
                {isBelowThreshold ? "Below Threshold" : "On Track"}
              </Badge>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
            <StatCard
              title="Attendance %"
              value={`${percent}%`}
              icon={<TrendUpIcon className="h-5 w-5" />}
              variant={
                isBelowThreshold
                  ? "danger"
                  : stats && stats.attendancePercent >= ATTENDANCE_THRESHOLD
                    ? "success"
                    : "default"
              }
            />
            <StatCard
              title="Present"
              value={stats?.presentCount ?? 0}
              subtitle={`of ${stats?.totalClasses ?? 0} classes`}
              icon={<ChartIcon className="h-5 w-5" />}
              variant="success"
            />
            <StatCard
              title="Absent"
              value={stats?.absentCount ?? 0}
              icon={<WarningIcon className="h-5 w-5" />}
              variant={isBelowThreshold ? "danger" : "warning"}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Attendance History
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Complete record of your class attendance
              </p>
            </div>
            <Badge variant="neutral">{attendance.length} records</Badge>
          </div>
          <Table<AttendanceRecord>
            columns={[
              { key: "date", header: "Date" },
              { key: "subject", header: "Subject" },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <Badge
                    variant={row.status === "Present" ? "success" : "danger"}
                    dot
                  >
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            data={attendance}
            emptyMessage="No attendance records found."
            stickyHeader
          />
        </div>
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <ProtectedRoute allowedRole={ROLES.STUDENT}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar links={sidebarLinks} />
          <StudentDashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
