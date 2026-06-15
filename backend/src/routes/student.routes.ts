import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requireSelfOrRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('faculty', 'admin'), studentController.list);
router.get('/:id', requireSelfOrRole('id', 'faculty', 'admin'), studentController.getById);

export default router;
