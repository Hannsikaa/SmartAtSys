import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as analyticsService from '../services/analytics.service';

export const getStudentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getStudentAnalytics(Number(req.params.id));
  res.json({ success: true, data });
});

export const getClassAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getClassAnalytics(Number(req.params.id));
  res.json({ success: true, data });
});

export const getDepartmentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const dept = Array.isArray(req.params.dept) ? req.params.dept[0] : req.params.dept;
  const data = await analyticsService.getDepartmentAnalytics(dept);
  res.json({ success: true, data });
});
