import { z } from 'zod';

export const householdSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  userId: z.number('User Id is required')
});

export type HouseholdRequest = z.infer<typeof householdSchema>;
