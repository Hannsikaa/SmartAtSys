import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requireSelfOrRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/student/:id',
  requireSelfOrRole('id', 'faculty', 'admin'),
  analyticsController.getStudentAnalytics
);

router.get(
  '/class/:id',
  requireRole('faculty', 'admin'),
  analyticsController.getClassAnalytics
);

router.get(
  '/department/:dept',
  requireRole('faculty', 'admin'),
  analyticsController.getDepartmentAnalytics
);

export default router;
