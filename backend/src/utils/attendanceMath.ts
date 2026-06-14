export function calculatePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100 * 100) / 100;
}

export function countPresentAbsent(records: { Status: string }[]): {
  present: number;
  absent: number;
  total: number;
  percentage: number;
} {
  const present = records.filter((r) => r.Status === 'Present').length;
  const absent = records.filter((r) => r.Status === 'Absent').length;
  const total = records.length;

  return {
    present,
    absent,
    total,
    percentage: calculatePercentage(present, total),
  };
}

export const ATTENDANCE_THRESHOLD = 75;
export const RISK_SCORE_THRESHOLD = 70;
