import { prisma } from '../database/index';

import type { Prisma, User } from '@prisma/client';
import type { SafeUser } from '../types/user';

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({
    data: {
      forename: data.forename,
      surname: data.surname,
      email: data.email,
      phone: data.phone ?? null,
      password: data.password
    }
  });
}

export async function getUserById(id: number): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      forename: true,
      surname: true,
      email: true,
      phone: true,
      createdAt: true,
      households: {
        select: {
          id: true,
          roleId: true
        }
      }
    }
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email }
  });
}
