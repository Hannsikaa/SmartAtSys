import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const pool = await getPool();
  const classId = Number(req.params.id);

  const classCheck = await pool
    .request()
    .input('classId', sql.Int, classId)
    .query(`
      SELECT c.ClassID, f.Department
      FROM Classes c
      INNER JOIN Faculty f ON c.FacultyID = f.FacultyID
      WHERE c.ClassID = @classId
    `);

  if (classCheck.recordset.length === 0) {
    throw new NotFoundError('Class not found');
  }

  const department = classCheck.recordset[0].Department;

  const result = await pool
    .request()
    .input('department', sql.VarChar(30), department)
    .query(`
      SELECT StudentID, StudentName, RollNo
      FROM Students
      WHERE Department = @department
      ORDER BY StudentName
    `);

  const students = result.recordset.map(
    (row: { StudentID: number; StudentName: string; RollNo: string }) => ({
      studentId: row.StudentID,
      studentName: row.StudentName,
      rollNo: row.RollNo,
    })
  );

  res.json({ success: true, data: students });
});
