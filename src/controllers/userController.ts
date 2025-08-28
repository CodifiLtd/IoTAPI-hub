import {
  createUser,
  getUserById,
  getUserDevicesById
} from '../services/userService';
import { userIdParamsSchema, userSchema } from '../schemas/user';
import bcrypt from 'bcrypt';
import { handleApiError } from '../utils/errorHandler';
import { logger } from '../logger/index';

import type { Response } from 'express';
import type { ApiResponse, RegisterUserSuccess } from '../types/api';
import type { SafeUser } from '../types/user';
import type { User as UserRequest, UserIdParams } from '../schemas/user';
import type { User, Device } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth';

export async function registerUser(
  req: AuthenticatedRequest<unknown, unknown, UserRequest>,
  res: Response<ApiResponse<RegisterUserSuccess>>
): Promise<Response<ApiResponse<RegisterUserSuccess>>> {
  try {
    logger.info('User registration request');

    const validatedData: UserRequest = userSchema.parse(req.body);

    logger.info('Hashing password');

    const passwordHash: string = await bcrypt.hash(validatedData.password, 10);

    logger.info('Creating user');

    const user: User = await createUser({
      ...validatedData,
      password: passwordHash
    });

    logger.info(`User created: ${user.email} (ID: ${user.id})`);

    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    return handleApiError(err, res);
  }
}

export async function getUser(
  req: AuthenticatedRequest<UserIdParams>,
  res: Response<ApiResponse<SafeUser>>
): Promise<Response<ApiResponse<SafeUser>>> {
  logger.info('Get user by ID request');

  const parsed = userIdParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return handleApiError(parsed.error, res);
  }

  const { id } = parsed.data;

  try {
    logger.info('Retrieving user');

    const user: SafeUser | null = await getUserById(id);

    if (!user) {
      logger.error('User not found');

      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    return handleApiError(err, res, 500);
  }
}

export async function getUserDevices(
  req: AuthenticatedRequest<UserIdParams>,
  res: Response<ApiResponse<Device[]>>
): Promise<Response<ApiResponse<Device[]>>> {
  logger.info('Get user devices request');

  const parsed = userIdParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return handleApiError(parsed.error, res);
  }

  const { id } = parsed.data;

  try {
    logger.info('Retrieving devices');

    const devices: Device[] | null = await getUserDevicesById(id);

    if (!devices.length) {
      logger.error('Devices not found');

      return res.status(404).json({ error: 'Devices not found' });
    }

    return res.json(devices);
  } catch (err: unknown) {
    return handleApiError(err, res, 500);
  }
}
