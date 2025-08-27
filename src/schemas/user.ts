import { z } from 'zod';

export const userSchema = z.object({
  forename: z.string().min(1, 'Forename is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional().default('null')
});

export const userIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'User ID must be a number').transform(Number)
});

export type User = z.infer<typeof userSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
