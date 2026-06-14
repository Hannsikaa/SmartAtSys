import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { AttendanceRecord } from '../types';
import { MarkAttendanceInput, UpdateAttendanceInput } from '../validators/attendance.validator';
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

export async function getStudentAttendance(studentId: number): Promise<AttendanceRecord[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT * FROM Attendance
      WHERE StudentID = @studentId
      ORDER BY AttendanceDate DESC
    `);

  return result.recordset;
}

export async function getClassAttendance(classId: number): Promise<AttendanceRecord[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('classId', sql.Int, classId)
    .query(`
      SELECT * FROM Attendance
      WHERE ClassID = @classId
      ORDER BY AttendanceDate DESC, StudentID
    `);

  return result.recordset;
}
