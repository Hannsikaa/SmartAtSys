import { z } from 'zod';

export const markAttendanceSchema = z.object({
  studentId: z.number().int().positive(),
  classId: z.number().int().positive(),
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['Present', 'Absent']),
});

export const updateAttendanceSchema = z.object({
  status: z.enum(['Present', 'Absent']),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
