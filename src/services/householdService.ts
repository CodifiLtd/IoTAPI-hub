import { prisma } from '../database/index';

import type { Household, Prisma } from '@prisma/client';

export async function createHousehold(
  data: Prisma.HouseholdCreateInput,
  userId: number
): Promise<Household> {
  return prisma.household.create({
    data: {
      name: data.name,
      description: data.description,
      users: {
        create: {
          user: { connect: { id: userId } },
          role: { connect: { id: 1 } }
        }
      }
    }
  });
}
