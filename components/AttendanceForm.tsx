"use client";

import { useEffect, useState } from "react";
import { getStudents, markAttendance, type Student } from "@/lib/api";
import { CLASSES, SUBJECTS } from "@/lib/constants";
import Card from "./Card";
import Table from "./Table";
import Button from "./Button";
import Badge from "./Badge";
import LoadingSpinner from "./LoadingSpinner";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  UsersIcon,
} from "./Icons";

interface AttendanceRow extends Student {
  status: "Present" | "Absent";
}

function StatusToggle({
  status,
  onChange,
}: {
  status: "Present" | "Absent";
  onChange: (status: "Present" | "Absent") => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50/80 p-1">
      <button
        type="button"
        onClick={() => onChange("Present")}
        className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
          status === "Present"
            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
            : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
        }`}
      >
        Present
      </button>
      <button
        type="button"
        onClick={() => onChange("Absent")}
        className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
          status === "Absent"
            ? "bg-red-500 text-white shadow-sm shadow-red-500/25"
            : "text-slate-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        Absent
      </button>
    </div>
  );
}

export default function AttendanceForm() {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [students, setStudents] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!classId) {
      setStudents([]);
      return;
    }

    async function loadStudents() {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getStudents(classId);
        setStudents(data.map((s) => ({ ...s, status: "Present" as const })));
      } catch {
        setMessage({ type: "error", text: "Failed to load students." });
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [classId]);

  function setStatus(studentId: string, status: "Present" | "Absent") {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || !subjectId || students.length === 0) {
      setMessage({
        type: "error",
        text: "Please select class, subject, and mark attendance.",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await markAttendance({
        classId,
        subjectId,
        date: today,
        records: students.map((s) => ({
          studentId: s.id,
          status: s.status,
        })),
      });
      setMessage({ type: "success", text: "Attendance saved successfully!" });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save attendance. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.length - presentCount;
  const attendanceRate =
    students.length > 0
      ? Math.round((presentCount / students.length) * 100)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-600/25">
            1
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Class & Subject
            </h2>
            <p className="text-sm text-slate-500">
              Choose the class and subject for today&apos;s session
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Class
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="input"
              required
            >
              <option value="">Select class</option>
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="input"
              required
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={today}
                readOnly
                className="input cursor-default bg-slate-50 pl-10 text-slate-600"
              />
            </div>
          </div>
        </div>
      </Card>

      {!classId && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <UsersIcon className="h-7 w-7" />
          </div>
          <p className="font-medium text-slate-700">
            Select a class to load the student list
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Step 2 will appear once students are loaded
          </p>
        </div>
      )}

      {classId && loading && (
        <Card className="flex justify-center py-16">
          <LoadingSpinner label="Loading students..." />
        </Card>
      )}

      {classId && !loading && students.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="!p-5">
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {students.length}
              </p>
            </Card>
            <Card className="!p-5">
              <p className="text-sm font-medium text-slate-500">Present</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {presentCount}
              </p>
            </Card>
            <Card className="!p-5">
              <p className="text-sm font-medium text-slate-500">Absent</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {absentCount}
              </p>
            </Card>
          </div>

          <Card padding={false} className="overflow-hidden">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-600/25">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Mark Attendance
                    </h2>
                    <p className="text-sm text-slate-500">
                      Toggle status for each student
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" dot>
                    {presentCount} Present
                  </Badge>
                  <Badge variant="danger" dot>
                    {absentCount} Absent
                  </Badge>
                  <Badge variant="primary">{attendanceRate}% Rate</Badge>
                </div>
              </div>
            </div>
            <Table<AttendanceRow>
              columns={[
                { key: "name", header: "Student Name" },
                { key: "rollNo", header: "Roll No" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <StatusToggle
                      status={row.status}
                      onChange={(status) => setStatus(row.id, status)}
                    />
                  ),
                },
              ]}
              data={students}
              stickyHeader
            />
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-600/25">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Submit Attendance
                  </h2>
                  <p className="text-sm text-slate-500">
                    Review and save today&apos;s records
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                disabled={submitting || !subjectId}
                className="gap-2"
              >
                <ClipboardIcon className="h-4 w-4" />
                {submitting ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </Card>
        </>
      )}

      {classId && !loading && students.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
          <p className="font-medium text-slate-600">
            No students found for this class.
          </p>
        </div>
      )}

      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-sm font-medium shadow-sm ${
            message.type === "success"
              ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
              : "border-red-200/80 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
          ) : null}
          {message.text}
        </div>
      )}
    </form>
  );
}
