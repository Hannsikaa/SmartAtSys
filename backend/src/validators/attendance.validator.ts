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

export const markBulkAttendanceSchema = z.object({
  classId: z.number().int().positive(),
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  records: z
    .array(
      z.object({
        studentId: z.number().int().positive(),
        status: z.enum(['Present', 'Absent']),
      })
    )
    .min(1),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type MarkBulkAttendanceInput = z.infer<typeof markBulkAttendanceSchema>;
