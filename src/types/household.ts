import type { Household } from '@prisma/client';

/**
 * Type for successful household registration response.
 * Contains id, name, and description.
 */
export type registerHouseholdSuccess = Pick<
  Household,
  'id' | 'name' | 'description'
>;
