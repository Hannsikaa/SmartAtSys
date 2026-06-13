import { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "primary" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  primary: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-amber-500",
  primary: "bg-blue-500",
  neutral: "bg-slate-400",
};

export default function Badge({
  variant = "neutral",
  children,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`badge ${variantStyles[variant]}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
