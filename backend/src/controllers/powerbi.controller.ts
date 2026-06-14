import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as powerbiService from '../services/powerbi.service';

export const getEmbed = asyncHandler(async (_req: Request, res: Response) => {
  const data = await powerbiService.getEmbedConfig();
  res.json({ success: true, data });
});
