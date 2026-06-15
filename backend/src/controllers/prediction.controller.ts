import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { predictForStudent, predictAllAtRisk } from '../ai/predictor';

export const getStudentPrediction = asyncHandler(async (req: Request, res: Response) => {
  const data = await predictForStudent(Number(req.params.id));
  res.json({ success: true, data });
});

export const getAllAtRisk = asyncHandler(async (_req: Request, res: Response) => {
  const data = await predictAllAtRisk();
  res.json({ success: true, data });
});
