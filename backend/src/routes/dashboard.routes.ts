import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/student',
  requireRole('student', 'faculty', 'admin'),
  dashboardController.getStudent
);

router.get('/admin', requireRole('admin'), dashboardController.getAdmin);

export default router;
