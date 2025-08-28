import type { User } from '@prisma/client';

/**
 * Type for user object returned from API, omitting password and updatedAt.
 * Includes households array with id and roleId.
 */
export type SafeUser = Omit<User, 'password' | 'updatedAt'> & {
  households: {
    id: number;
    roleId: number;
  }[];
};
