import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { PredictionResult } from '../types';
import { countPresentAbsent, ATTENDANCE_THRESHOLD, RISK_SCORE_THRESHOLD } from '../utils/attendanceMath';
import { aggregateMonthlyAttendance, analyzeDeclineTrend } from './trendAnalyzer';
import {
  scoreConsecutiveAbsences,
  scoreProximityToThreshold,
  scoreVariance,
  computeRiskScore,
  predictNextMonthAttendance,
} from './riskScorer';

export async function predictForStudent(studentId: number): Promise<PredictionResult> {
  const pool = await getPool();

  const studentCheck = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query('SELECT StudentID FROM Students WHERE StudentID = @studentId');

  if (studentCheck.recordset.length === 0) {
    throw new NotFoundError('Student not found');
  }

  const result = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT AttendanceDate, Status
      FROM Attendance
      WHERE StudentID = @studentId
      ORDER BY AttendanceDate
    `);

  const records = result.recordset;
  const stats = countPresentAbsent(records);
  const monthlyData = aggregateMonthlyAttendance(records);

  const declineScore = analyzeDeclineTrend(monthlyData);
  const consecutiveScore = scoreConsecutiveAbsences(records);
  const proximityScore = scoreProximityToThreshold(stats.percentage);
  const varianceScore = scoreVariance(monthlyData.map((m) => m.attendance));

  const riskScore = computeRiskScore(
    declineScore,
    consecutiveScore,
    proximityScore,
    varianceScore
  );

  const predictedAttendance = predictNextMonthAttendance(monthlyData, stats.percentage);

  const status: 'At Risk' | 'Safe' =
    predictedAttendance < ATTENDANCE_THRESHOLD || riskScore >= RISK_SCORE_THRESHOLD
      ? 'At Risk'
      : 'Safe';

  return {
    studentId,
    currentAttendance: stats.percentage,
    predictedAttendance,
    riskScore,
    status,
  };
}

export async function predictAllAtRisk(): Promise<PredictionResult[]> {
  const pool = await getPool();

  const students = await pool.request().query('SELECT StudentID FROM Students');
  const results: PredictionResult[] = [];

  for (const row of students.recordset) {
    const prediction = await predictForStudent(row.StudentID);
    if (prediction.status === 'At Risk') {
      results.push(prediction);
    }
  }

  return results.sort((a, b) => b.riskScore - a.riskScore);
}
