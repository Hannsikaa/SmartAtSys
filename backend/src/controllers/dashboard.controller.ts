import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { ForbiddenError } from '../utils/errors';
import * as dashboardService from '../services/dashboard.service';

export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  let studentId: number;

  if (req.user!.role === 'student') {
    studentId = req.user!.userId;
  } else if (req.query.studentId) {
    studentId = Number(req.query.studentId);
  } else {
    throw new ForbiddenError('studentId query parameter required');
  }

  const data = await dashboardService.getStudentDashboard(studentId);
  res.json({ success: true, data });
});

export const getAdmin = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.getAdminDashboard();
  res.json({ success: true, data });
});
