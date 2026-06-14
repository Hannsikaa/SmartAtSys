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
      SELECT FacultyID, FacultyName, Department
      FROM Faculty WHERE FacultyID = @id
    `);

  if (result.recordset.length === 0) {
    throw new NotFoundError('Faculty not found');
  }

  res.json({ success: true, data: result.recordset[0] });
});

export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const pool = await getPool();
  const facultyId = Number(req.params.id);

  const result = await pool
    .request()
    .input('facultyId', sql.Int, facultyId)
    .query(`
      SELECT ClassID, FacultyID, SubjectName
      FROM Classes WHERE FacultyID = @facultyId
    `);

  res.json({ success: true, data: result.recordset });
});
