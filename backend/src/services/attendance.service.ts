import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { AttendanceRecord } from '../types';
import { MarkAttendanceInput, UpdateAttendanceInput, MarkBulkAttendanceInput } from '../validators/attendance.validator';
import { predictForStudent } from '../ai/predictor';
import { createAutoNotification } from './notification.service';
import { getNextId } from '../utils/dbHelpers';

export async function markAttendance(
  input: MarkAttendanceInput
): Promise<{ attendance: AttendanceRecord; prediction: Awaited<ReturnType<typeof predictForStudent>> }> {
  const pool = await getPool();
  const attendanceId = await getNextId('Attendance', 'AttendanceID');

  const result = await pool
    .request()
    .input('attendanceId', sql.Int, attendanceId)
    .input('studentId', sql.Int, input.studentId)
    .input('classId', sql.Int, input.classId)
    .input('date', sql.Date, input.attendanceDate)
    .input('status', sql.VarChar(10), input.status)
    .query(`
      INSERT INTO Attendance (AttendanceID, AttendanceDate, ClassID, Status, StudentID)
      OUTPUT INSERTED.*
      VALUES (@attendanceId, @date, @classId, @status, @studentId)
    `);

  const attendance = result.recordset[0] as AttendanceRecord;
  const prediction = await predictForStudent(input.studentId);
  await createAutoNotification(input.studentId, prediction);

  return { attendance, prediction };
}

export async function updateAttendance(
  attendanceId: number,
  input: UpdateAttendanceInput
): Promise<{ attendance: AttendanceRecord; prediction: Awaited<ReturnType<typeof predictForStudent>> }> {
  const pool = await getPool();

  const existing = await pool
    .request()
    .input('id', sql.Int, attendanceId)
    .query('SELECT * FROM Attendance WHERE AttendanceID = @id');

  if (existing.recordset.length === 0) {
    throw new NotFoundError('Attendance record not found');
  }

  const result = await pool
    .request()
    .input('id', sql.Int, attendanceId)
    .input('status', sql.VarChar(10), input.status)
    .query(`
      UPDATE Attendance
      SET Status = @status
      OUTPUT INSERTED.*
      WHERE AttendanceID = @id
    `);

  const attendance = result.recordset[0] as AttendanceRecord;
  const prediction = await predictForStudent(attendance.StudentID);
  await createAutoNotification(attendance.StudentID, prediction);

  return { attendance, prediction };
}

function formatDate(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
}

function mapAttendanceRow(row: {
  AttendanceID: number;
  AttendanceDate: Date;
  ClassID: number;
  Status: string;
  StudentID: number;
  SubjectName?: string;
}) {
  return {
    attendanceId: row.AttendanceID,
    date: formatDate(row.AttendanceDate),
    classId: row.ClassID,
    status: row.Status,
    studentId: row.StudentID,
    ...(row.SubjectName !== undefined ? { subject: row.SubjectName } : {}),
  };
}

export async function markAttendanceBulk(
  input: MarkBulkAttendanceInput
): Promise<{ count: number; records: Awaited<ReturnType<typeof markAttendance>>[] }> {
  const results: Awaited<ReturnType<typeof markAttendance>>[] = [];

  for (const record of input.records) {
    const result = await markAttendance({
      studentId: record.studentId,
      classId: input.classId,
      attendanceDate: input.attendanceDate,
      status: record.status,
    });
    results.push(result);
  }

  return { count: results.length, records: results };
}

export async function getStudentAttendance(studentId: number) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT a.AttendanceID, a.AttendanceDate, a.ClassID, a.Status, a.StudentID, c.SubjectName
      FROM Attendance a
      INNER JOIN Classes c ON a.ClassID = c.ClassID
      WHERE a.StudentID = @studentId
      ORDER BY a.AttendanceDate DESC
    `);

  return result.recordset.map(mapAttendanceRow);
}

export async function getClassAttendance(classId: number) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('classId', sql.Int, classId)
    .query(`
      SELECT a.AttendanceID, a.AttendanceDate, a.ClassID, a.Status, a.StudentID, c.SubjectName
      FROM Attendance a
      INNER JOIN Classes c ON a.ClassID = c.ClassID
      WHERE a.ClassID = @classId
      ORDER BY a.AttendanceDate DESC, a.StudentID
    `);

  return result.recordset.map(mapAttendanceRow);
}
