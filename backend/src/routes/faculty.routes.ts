import { Router } from 'express';
import * as facultyController from '../controllers/faculty.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/:id', requireRole('faculty', 'admin'), facultyController.getById);
router.get('/:id/classes', requireRole('faculty', 'admin'), facultyController.getClasses);

export default router;
