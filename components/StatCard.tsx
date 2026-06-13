import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "danger";
  icon?: ReactNode;
  trend?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-blue-50 text-blue-600",
    value: "text-blue-600",
    accent: "from-blue-500/10 to-transparent",
  },
  success: {
    iconBg: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-600",
    accent: "from-emerald-500/10 to-transparent",
  },
  warning: {
    iconBg: "bg-amber-50 text-amber-600",
    value: "text-amber-600",
    accent: "from-amber-500/10 to-transparent",
  },
  danger: {
    iconBg: "bg-red-50 text-red-600",
    value: "text-red-600",
    accent: "from-red-500/10 to-transparent",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  variant = "default",
  icon,
  trend,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300/80 hover:shadow-md">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.accent} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${styles.value}`}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs font-medium text-slate-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className="mt-2 text-xs font-medium text-slate-500">{trend}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} transition-transform duration-200 group-hover:scale-105`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
