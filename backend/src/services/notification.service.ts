import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { NotificationRecord, PredictionResult } from '../types';
import { getNextId } from '../utils/dbHelpers';

export async function getNotifications(studentId: number): Promise<NotificationRecord[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT * FROM Notifications
      WHERE StudentID = @studentId
      ORDER BY NotificationID DESC
    `);

  return result.recordset;
}

export async function createNotification(
  studentId: number,
  message: string
): Promise<NotificationRecord> {
  const pool = await getPool();

  const studentCheck = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query('SELECT StudentID FROM Students WHERE StudentID = @studentId');

  if (studentCheck.recordset.length === 0) {
    throw new NotFoundError('Student not found');
  }

  const notificationId = await getNextId('Notifications', 'NotificationID');

  const result = await pool
    .request()
    .input('notificationId', sql.Int, notificationId)
    .input('studentId', sql.Int, studentId)
    .input('message', sql.VarChar(255), message)
    .query(`
      INSERT INTO Notifications (NotificationID, StudentID, Message)
      OUTPUT INSERTED.*
      VALUES (@notificationId, @studentId, @message)
    `);

  return result.recordset[0];
}

export async function createAutoNotification(
  studentId: number,
  prediction: PredictionResult
): Promise<NotificationRecord | null> {
  const pool = await getPool();

  const message =
    prediction.status === 'At Risk'
      ? 'Warning: Attendance likely below 75%'
      : 'Safe: Attendance healthy';

  const recent = await pool
    .request()
    .input('studentId', sql.Int, studentId)
    .query(`
      SELECT TOP 1 Message FROM Notifications
      WHERE StudentID = @studentId
      ORDER BY NotificationID DESC
    `);

  if (recent.recordset.length > 0 && recent.recordset[0].Message === message) {
    return null;
  }

  return createNotification(studentId, message);
}

export async function processAllRiskNotifications(): Promise<number> {
  const { predictAllAtRisk } = await import('../ai/predictor');
  const atRisk = await predictAllAtRisk();
  let created = 0;

  for (const prediction of atRisk) {
    const result = await createAutoNotification(prediction.studentId, prediction);
    if (result) created++;
  }

  return created;
}
