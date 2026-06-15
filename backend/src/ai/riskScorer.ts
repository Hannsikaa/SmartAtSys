import { ATTENDANCE_THRESHOLD } from '../utils/attendanceMath';

export function scoreConsecutiveAbsences(
  records: { AttendanceDate: Date; Status: string }[]
): number {
  if (records.length === 0) return 0;

  const sorted = [...records].sort(
    (a, b) => new Date(a.AttendanceDate).getTime() - new Date(b.AttendanceDate).getTime()
  );

  let maxStreak = 0;
  let currentStreak = 0;

  for (const record of sorted) {
    if (record.Status === 'Absent') {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  if (maxStreak >= 4) return 100;
  if (maxStreak === 3) return 80;
  if (maxStreak === 2) return 50;
  if (maxStreak === 1) return 20;
  return 0;
}

export function scoreProximityToThreshold(currentAttendance: number): number {
  if (currentAttendance >= ATTENDANCE_THRESHOLD + 10) return 0;
  if (currentAttendance >= ATTENDANCE_THRESHOLD) {
    return Math.round(((ATTENDANCE_THRESHOLD + 10 - currentAttendance) / 10) * 100);
  }
  return Math.min(100, Math.round(((ATTENDANCE_THRESHOLD - currentAttendance) / ATTENDANCE_THRESHOLD) * 100 + 50));
}

export function scoreVariance(monthlyPercentages: number[]): number {
  if (monthlyPercentages.length < 2) return 0;

  const mean = monthlyPercentages.reduce((a, b) => a + b, 0) / monthlyPercentages.length;
  const variance =
    monthlyPercentages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    monthlyPercentages.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev > 15) return 100;
  if (stdDev > 10) return 70;
  if (stdDev > 5) return 40;
  return 10;
}

export function computeRiskScore(
  declineScore: number,
  consecutiveAbsenceScore: number,
  proximityScore: number,
  varianceScore: number
): number {
  const weighted =
    declineScore * 0.35 +
    consecutiveAbsenceScore * 0.3 +
    proximityScore * 0.25 +
    varianceScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function predictNextMonthAttendance(
  monthlyData: { attendance: number }[],
  currentAttendance: number
): number {
  if (monthlyData.length < 2) {
    return currentAttendance;
  }

  const recent = monthlyData.slice(-3);
  let totalDecline = 0;

  for (let i = 1; i < recent.length; i++) {
    totalDecline += recent[i - 1].attendance - recent[i].attendance;
  }

  const avgDecline = totalDecline / (recent.length - 1);
  const predicted = currentAttendance - avgDecline;

  return Math.round(Math.max(0, Math.min(100, predicted)));
}
