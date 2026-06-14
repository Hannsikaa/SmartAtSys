import { z } from 'zod';

export const loginSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('student'),
    rollNo: z.string().min(1).max(20),
  }),
  z.object({
    role: z.literal('faculty'),
    facultyId: z.number().int().positive(),
  }),
  z.object({
    role: z.literal('admin'),
    facultyId: z.number().int().positive(),
  }),
]);

export type LoginInput = z.infer<typeof loginSchema>;
