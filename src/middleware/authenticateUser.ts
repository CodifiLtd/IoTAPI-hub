import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/userService';
import { logger } from '../logger/index';
import type { SafeUser } from '../types/user';
import type { AuthenticatedRequest, JwtPayload } from '../types/auth';

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  logger.info('Authenticating user');

  const authHeader = req.headers['authorization'];

  const token = authHeader?.split(' ')[1];

  if (!token) {
    logger.error('Bearer token not found');

    res.status(401).json({ error: 'Unauthorised' });

    return;
  }

  try {
    logger.info('Verifying token');

    const payload: JwtPayload = jwt.verify(
      token,
      process.env['JWT_SECRET'] ?? 'so_secret'
    ) as JwtPayload;

    logger.info('Retrieving user');

    const user: SafeUser | null = await getUserById(payload.userId);

    if (!user) {
      logger.error('User not found');

      res.status(401).json({ error: 'User not found' });

      return;
    }

    req['userId'] = user.id;
    req['households'] = user.households;

    next();
  } catch (err) {
    logger.error('Authentication failed', err);

    res.status(401).json({ error: 'Invalid or expired token' });

    return;
  }
}
