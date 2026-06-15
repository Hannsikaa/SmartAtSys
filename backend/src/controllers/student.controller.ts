import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { getPool, sql } from '../config/db';
import { NotFoundError } from '../utils/errors';

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, Number(req.params.id))
    .query(`
      SELECT StudentID, StudentName, RollNo, Department, YearOfStudy
      FROM Students WHERE StudentID = @id
    `);

  if (result.recordset.length === 0) {
    throw new NotFoundError('Student not found');
  }

  res.json({ success: true, data: result.recordset[0] });
});

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT StudentID, StudentName, RollNo, Department, YearOfStudy
    FROM Students
    ORDER BY StudentName
  `);

  res.json({ success: true, data: result.recordset });
});
