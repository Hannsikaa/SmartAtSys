import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requireSelfOrRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { markAttendanceSchema, updateAttendanceSchema, markBulkAttendanceSchema } from '../validators/attendance.validator';

const router = Router();

router.use(authenticate);

router.post(
  '/mark-bulk',
  requireRole('faculty', 'admin'),
  validate(markBulkAttendanceSchema),
  attendanceController.markBulk
);

router.post(
  '/mark',
  requireRole('faculty', 'admin'),
  validate(markAttendanceSchema),
  attendanceController.mark
);

router.put(
  '/:id',
  requireRole('faculty', 'admin'),
  validate(updateAttendanceSchema),
  attendanceController.update
);

router.get(
  '/student/:id',
  requireSelfOrRole('id', 'faculty', 'admin'),
  attendanceController.getByStudent
);

router.get(
  '/class/:id',
  requireRole('faculty', 'admin'),
  attendanceController.getByClass
);

export default router;
