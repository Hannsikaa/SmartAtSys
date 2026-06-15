import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as attendanceService from '../services/attendance.service';

export const mark = asyncHandler(async (req: Request, res: Response) => {
  const result = await attendanceService.markAttendance(req.body);
  res.status(201).json({ success: true, data: result });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const result = await attendanceService.updateAttendance(Number(req.params.id), req.body);
  res.json({ success: true, data: result });
});

export const markBulk = asyncHandler(async (req: Request, res: Response) => {
  const result = await attendanceService.markAttendanceBulk(req.body);
  res.status(201).json({ success: true, data: result });
});

export const getByStudent = asyncHandler(async (req: Request, res: Response) => {
  const records = await attendanceService.getStudentAttendance(Number(req.params.id));
  res.json({ success: true, data: records });
});

export const getByClass = asyncHandler(async (req: Request, res: Response) => {
  const records = await attendanceService.getClassAttendance(Number(req.params.id));
  res.json({ success: true, data: records });
});
