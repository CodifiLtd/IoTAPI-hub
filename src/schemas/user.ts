import { z } from 'zod';

/**
 * Zod schema for user registration validation.
 * Requires forename, surname, email, password, and optional phone.
 */
export const userSchema = z.object({
  forename: z.string().min(1, 'Forename is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional().default('null')
});

/**
 * Zod schema for user ID parameter validation.
 * Requires numeric string ID.
 */
export const userIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'User ID must be a number').transform(Number)
});

/**
 * Type for user object inferred from userSchema.
 */
export type User = z.infer<typeof userSchema>;
/**
 * Type for user ID params inferred from userIdParamsSchema.
 */
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
