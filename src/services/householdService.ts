import { prisma } from '../database/index';

import type { Household } from '@prisma/client';
import type { HouseholdRequest } from '../schemas/household';

/**
 * Creates a new household and associates the user as owner.
 * @param data Household creation data
 * @returns Created household
 */
export async function createHousehold(
  data: HouseholdRequest
): Promise<Household> {
  return await prisma.household.create({
    data: {
      name: data.name,
      description: data.description,
      users: {
        create: {
          user: { connect: { id: data.userId } },
          role: { connect: { id: 1 } }
        }
      }
    }
  });
}
