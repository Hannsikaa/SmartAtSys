import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as notificationService from '../services/notification.service';
import { z } from 'zod';

const createNotificationSchema = z.object({
  studentId: z.number().int().positive(),
  message: z.string().min(1).max(255),
});

export const getByStudent = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationService.getNotifications(Number(req.params.studentId));
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = createNotificationSchema.parse(req.body);
  const data = await notificationService.createNotification(input.studentId, input.message);
  res.status(201).json({ success: true, data });
});
