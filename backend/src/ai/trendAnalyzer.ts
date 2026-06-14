import { MonthlyAttendance } from '../types';

export function analyzeDeclineTrend(monthlyData: MonthlyAttendance[]): number {
  if (monthlyData.length < 2) return 0;

  let consecutiveDeclines = 0;
  let maxConsecutive = 0;

  for (let i = 1; i < monthlyData.length; i++) {
    const decline = monthlyData[i - 1].attendance - monthlyData[i].attendance;
    if (decline > 0) {
      consecutiveDeclines++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveDeclines);
    } else {
      consecutiveDeclines = 0;
    }
  }

  const latestDecline =
    monthlyData.length >= 2
      ? monthlyData[monthlyData.length - 2].attendance -
        monthlyData[monthlyData.length - 1].attendance
      : 0;

  let score = 0;

  if (latestDecline > 0) {
    score += Math.min(latestDecline * 2, 40);
  }

  if (maxConsecutive >= 2) {
    score += Math.min(maxConsecutive * 15, 60);
  }

  return Math.min(score, 100);
}

export function aggregateMonthlyAttendance(
  records: { AttendanceDate: Date; Status: string }[]
): MonthlyAttendance[] {
  const monthMap = new Map<string, { present: number; total: number }>();

  for (const record of records) {
    const date = new Date(record.AttendanceDate);
    const key = date.toLocaleString('en-US', { month: 'short' });
    const entry = monthMap.get(key) ?? { present: 0, total: 0 };
    entry.total++;
    if (record.Status === 'Present') entry.present++;
    monthMap.set(key, entry);
  }

  return Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
  }));
}
