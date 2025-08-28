import { z } from 'zod';

/**
 * Zod schema for login request validation.
 * Requires email and password fields.
 */
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

/**
 * Type for login request inferred from loginSchema.
 */
export type LoginRequest = z.infer<typeof loginSchema>;
