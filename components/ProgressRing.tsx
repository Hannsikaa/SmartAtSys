interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  threshold?: number;
}

export default function ProgressRing({
  percent,
  size = 120,
  strokeWidth = 10,
  threshold = 75,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color =
    percent >= threshold
      ? "#059669"
      : percent >= threshold - 10
        ? "#d97706"
        : "#dc2626";

  const trackColor = "#e2e8f0";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tracking-tight text-slate-800">
          {percent}%
        </span>
        <span className="text-xs font-medium text-slate-500">Attendance</span>
      </div>
    </div>
  );
}
