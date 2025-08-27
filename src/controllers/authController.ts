import { getUserByEmail } from '../services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleApiError } from '../utils/errorHandler';

import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/api';
import type { LoginRequest } from '../schemas/auth';
import type { LoginSuccess } from '../types/auth';
import type { User } from '@prisma/client';
import { logger } from '../logger/index';

export async function login(
  req: Request<unknown, unknown, LoginRequest>,
  res: Response<ApiResponse<LoginSuccess>>
): Promise<Response<ApiResponse<LoginSuccess>>> {
  try {
    logger.info('Login request');

    const { email, password } = req.body;

    if (!email || !password) {
      logger.error('Missing credentials');

      return res.status(400).json({ error: 'Email and password are required' });
    }

    logger.info('Retrieving user', email);

    const user: User | null = await getUserByEmail(email);

    if (!user) {
      logger.error('User not found');

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      logger.error('Invalid password');

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env['JWT_SECRET'] ?? 'so_secret',
      { expiresIn: '5m' }
    );

    return res.json({ id: user.id, email: user.email, token });
  } catch (err) {
    return handleApiError(err, res, 500);
  }
}
