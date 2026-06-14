import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as authService from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await authService.getMe(req.user.userId, req.user.role);
  res.json({ success: true, data: user });
});
