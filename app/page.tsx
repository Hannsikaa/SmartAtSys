import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowRightIcon,
  ChartIcon,
  CheckCircleIcon,
  SparklesIcon,
  UsersIcon,
} from "@/components/Icons";
import { ROUTES } from "@/lib/constants";

const features = [
  {
    icon: <UsersIcon className="h-6 w-6" />,
    title: "Student Dashboard",
    description:
      "View personal attendance percentage, class history, and threshold warnings in one place.",
  },
  {
    icon: <CheckCircleIcon className="h-6 w-6" />,
    title: "Faculty Attendance Management",
    description:
      "Select class and subject, mark present or absent for each student, and save records.",
  },
  {
    icon: <ChartIcon className="h-6 w-6" />,
    title: "Power BI Analytics",
    description:
      "Embedded Microsoft Fabric dashboards for institution-wide attendance insights.",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "AI Risk Detection",
    description:
      "Identify students at risk of low attendance using analytics and threshold monitoring.",
  },
];

const techStack = [
  { name: "Next.js", description: "React framework with App Router" },
  { name: "Tailwind CSS", description: "Utility-first styling" },
  { name: "Microsoft Fabric", description: "Cloud data platform" },
  { name: "Power BI", description: "Business intelligence dashboards" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="landing" />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-mesh grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/60" />
        <div className="relative mx-auto max-w-4xl px-4 pt-36 pb-24 text-center sm:px-6 lg:px-8 lg:pt-44 lg:pb-32">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            Smart Attendance Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-tight">
            Smart Attendance Management System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
            Cloud + AI Powered Attendance Intelligence for Educational
            Institutions
          </p>
          <div className="mt-10">
            <Link
              href={ROUTES.LOGIN}
              className="btn btn-primary btn-lg inline-flex bg-white text-blue-700 shadow-md hover:bg-blue-50"
            >
              Get Started
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Features
          </h2>
          <p className="mt-3 text-slate-500">
            Core modules built for students, faculty, and administrators
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Technology Stack
            </h2>
            <p className="mt-3 text-slate-500">
              Built with modern, industry-standard tools
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 text-center transition-colors hover:border-blue-200 hover:bg-white"
              >
                <h3 className="text-base font-semibold text-blue-600">
                  {tech.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                S
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">SAMS</p>
                <p className="text-xs text-slate-500">
                  Smart Attendance Management System
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} SAMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
