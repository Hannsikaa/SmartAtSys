import { Router } from 'express';
import * as predictionController from '../controllers/prediction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requireSelfOrRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/student/:id',
  requireSelfOrRole('id', 'faculty', 'admin'),
  predictionController.getStudentPrediction
);

router.get(
  '/all-risk',
  requireRole('faculty', 'admin'),
  predictionController.getAllAtRisk
);

export default router;
