import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requireSelfOrRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:studentId',
  requireSelfOrRole('studentId', 'faculty', 'admin'),
  notificationController.getByStudent
);

router.post(
  '/create',
  requireRole('admin'),
  notificationController.create
);

export default router;
