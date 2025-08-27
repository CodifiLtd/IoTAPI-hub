import { prisma } from '../database/index';

import type { Device, Prisma, User } from '@prisma/client';
import type { SafeUser } from '../types/user';

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return await prisma.user.create({
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
  return await prisma.user.findUnique({
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
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserDevicesById(userId: number): Promise<Device[]> {
  const userWithDevices = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      households: {
        select: {
          household: {
            select: {
              devices: {}
            }
          }
        }
      }
    }
  });

  // Flatten devices across all households
  const devices: Device[] =
    userWithDevices?.households.flatMap(h => h.household.devices) ?? [];

  return devices;
}
