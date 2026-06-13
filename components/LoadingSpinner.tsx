interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizes[size]}`}
        role="status"
        aria-label={label}
      />
      {label && (
        <p className="text-sm font-medium text-slate-500 animate-pulse-soft">
          {label}
        </p>
      )}
    </div>
  );
}
