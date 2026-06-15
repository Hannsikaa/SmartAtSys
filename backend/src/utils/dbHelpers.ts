import { getPool, sql } from '../config/db';

export async function getNextId(
  table: 'Attendance' | 'Notifications',
  column: 'AttendanceID' | 'NotificationID'
): Promise<number> {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT ISNULL(MAX(${column}), 0) + 1 AS NextId FROM ${table}
  `);
  return result.recordset[0].NextId;
}
