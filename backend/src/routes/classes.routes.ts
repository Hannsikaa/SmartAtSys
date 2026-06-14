import { Router } from 'express';
import * as classesController from '../controllers/classes.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:id/students',
  requireRole('faculty', 'admin'),
  classesController.getStudents
);

export default router;
