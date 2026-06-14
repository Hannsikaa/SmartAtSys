import { getPool, sql } from '../config/db';
import { countPresentAbsent } from '../utils/attendanceMath';
import { NotFoundError } from '../utils/errors';

export async function getStudentAnalytics(studentId: number) {
  const pool = await getPool();

  const studentCheck = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query('SELECT StudentID, StudentName, Department FROM Students WHERE StudentID = @studentId');

  if (studentCheck.recordset.length === 0) {
    throw new NotFoundError('Student not found');
  }

  const result = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT Status FROM Attendance WHERE StudentID = @studentId
    `);

  const stats = countPresentAbsent(result.recordset);
  const student = studentCheck.recordset[0];

  return {
    studentId,
    studentName: student.StudentName,
    department: student.Department,
    ...stats,
  };
}

export async function getClassAnalytics(classId: number) {
  const pool = await getPool();

  const classCheck = await pool
    .request()
    .input('classId', sql.Int, classId)
    .query(`
      SELECT c.ClassID, c.SubjectName, f.Department
      FROM Classes c
      INNER JOIN Faculty f ON c.FacultyID = f.FacultyID
      WHERE c.ClassID = @classId
    `);

  if (classCheck.recordset.length === 0) {
    throw new NotFoundError('Class not found');
  }

  const result = await pool
    .request()
    .input('classId', sql.Int, classId)
    .query(`
      SELECT
        s.StudentID,
        s.StudentName,
        SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS absent,
        COUNT(a.AttendanceID) AS total
      FROM Attendance a
      INNER JOIN Students s ON a.StudentID = s.StudentID
      WHERE a.ClassID = @classId
      GROUP BY s.StudentID, s.StudentName
    `);

  const students = result.recordset.map((row: Record<string, number | string>) => {
    const present = Number(row.present);
    const total = Number(row.total);
    return {
      studentId: row.StudentID,
      studentName: row.StudentName,
      present,
      absent: Number(row.absent),
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  const classInfo = classCheck.recordset[0];

  return {
    classId,
    subjectName: classInfo.SubjectName,
    department: classInfo.Department,
    students,
  };
}

export async function getDepartmentAnalytics(department: string) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('department', sql.VarChar(30), department)
    .query(`
      SELECT
        s.StudentID,
        s.StudentName,
        SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS absent,
        COUNT(a.AttendanceID) AS total
      FROM Students s
      LEFT JOIN Attendance a ON s.StudentID = a.StudentID
      WHERE s.Department = @department
      GROUP BY s.StudentID, s.StudentName
    `);

  const students = result.recordset.map((row: Record<string, number | string>) => {
    const present = Number(row.present ?? 0);
    const total = Number(row.total ?? 0);
    return {
      studentId: row.StudentID,
      studentName: row.StudentName,
      present,
      absent: Number(row.absent ?? 0),
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  const totalPresent = students.reduce((sum: number, s: { present: number }) => sum + s.present, 0);
  const totalRecords = students.reduce((sum: number, s: { total: number }) => sum + s.total, 0);

  return {
    department,
    studentCount: students.length,
    overallPercentage: totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0,
    students,
  };
}
