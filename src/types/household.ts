import type { Household } from '@prisma/client';

export type registerHouseholdSuccess = Pick<
  Household,
  'id' | 'name' | 'description'
>;
