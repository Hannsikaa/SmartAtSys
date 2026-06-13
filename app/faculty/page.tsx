"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AttendanceForm from "@/components/AttendanceForm";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CheckCircleIcon } from "@/components/Icons";
import { ROLES, ROUTES } from "@/lib/constants";

const sidebarLinks = [
  {
    href: ROUTES.FACULTY,
    label: "Mark Attendance",
    icon: <CheckCircleIcon className="h-4 w-4" />,
  },
];

export default function FacultyPage() {
  return (
    <ProtectedRoute allowedRole={ROLES.FACULTY}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar links={sidebarLinks} />
          <div className="flex flex-1 flex-col bg-slate-50/50">
            <PageHeader
              title="Faculty Dashboard"
              description="Select class and subject to mark attendance for today's session"
              badge="Faculty Portal"
            />
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              <AttendanceForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
