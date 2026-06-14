import { Router } from 'express';
import * as powerbiController from '../controllers/powerbi.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.get('/embed', requireRole('faculty', 'admin'), powerbiController.getEmbed);

export default router;
