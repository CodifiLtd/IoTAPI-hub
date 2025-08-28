import { z } from 'zod';

/**
 * Zod schema for household registration validation.
 * Requires name, userId, and optional description.
 */
export const householdSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  userId: z.number('User Id is required')
});

/**
 * Type for household request inferred from householdSchema.
 */
export type HouseholdRequest = z.infer<typeof householdSchema>;
