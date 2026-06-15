import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { countPresentAbsent, ATTENDANCE_THRESHOLD } from '../utils/attendanceMath';
import { predictForStudent } from '../ai/predictor';

function formatDate(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
}

export async function getStudentDashboard(studentId: number) {
  const pool = await getPool();

  const studentCheck = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query('SELECT StudentID FROM Students WHERE StudentID = @studentId');

  if (studentCheck.recordset.length === 0) {
    throw new NotFoundError('Student not found');
  }

  const attendanceResult = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT Status FROM Attendance WHERE StudentID = @studentId
    `);

  const stats = countPresentAbsent(attendanceResult.recordset);

  const historyResult = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT a.AttendanceID, a.AttendanceDate, a.Status, c.SubjectName
      FROM Attendance a
      INNER JOIN Classes c ON a.ClassID = c.ClassID
      WHERE a.StudentID = @studentId
      ORDER BY a.AttendanceDate DESC
    `);

  const history = historyResult.recordset.map(
    (row: {
      AttendanceID: number;
      AttendanceDate: Date;
      Status: string;
      SubjectName: string;
    }) => ({
      attendanceId: row.AttendanceID,
      date: formatDate(row.AttendanceDate),
      subject: row.SubjectName,
      status: row.Status,
    })
  );

  const prediction = await predictForStudent(studentId);

  return {
    summary: {
      attendancePercentage: Math.round(stats.percentage),
      threshold: ATTENDANCE_THRESHOLD,
      isBelowThreshold: stats.percentage < ATTENDANCE_THRESHOLD,
      present: stats.present,
      absent: stats.absent,
      totalClasses: stats.total,
    },
    history,
    prediction: {
      status: prediction.status,
      riskScore: prediction.riskScore,
      predictedAttendance: Math.round(prediction.predictedAttendance),
    },
  };
}

export async function getAdminDashboard() {
  const pool = await getPool();

  const totalResult = await pool.request().query(`
    SELECT COUNT(*) AS totalStudents FROM Students
  `);
  const totalStudents = Number(totalResult.recordset[0].totalStudents);

  const avgResult = await pool.request().query(`
    SELECT
      SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS present,
      COUNT(*) AS total
    FROM Attendance
  `);

  const present = Number(avgResult.recordset[0].present ?? 0);
  const total = Number(avgResult.recordset[0].total ?? 0);
  const attendanceAverage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  const riskResult = await pool.request().query(`
    SELECT s.StudentID,
      SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS present,
      COUNT(a.AttendanceID) AS total
    FROM Students s
    LEFT JOIN Attendance a ON s.StudentID = a.StudentID
    GROUP BY s.StudentID
    HAVING COUNT(a.AttendanceID) > 0
      AND (SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID)) < ${ATTENDANCE_THRESHOLD}
  `);

  const riskStudentsCount = riskResult.recordset.length;

  return {
    totalStudents,
    attendanceAverage,
    riskStudentsCount,
    threshold: ATTENDANCE_THRESHOLD,
  };
}
