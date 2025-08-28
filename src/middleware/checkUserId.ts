import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';

/**
 * Express middleware to check if the provided user ID matches the token user ID.
 * Responds with 403 if user is not authorised, else calls next().
 * @param {AuthenticatedRequest} req - Express request object with user info.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {void}
 */
export function checkUserId(
  req: AuthenticatedRequest<{ id?: number }, unknown, { userId?: number }>,
  res: Response,
  next: NextFunction
): void {
  try {
    logger.info('Checking provided user ID matches token user ID');

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const userId = req.body?.userId ?? req.params.id;

    const doesTokenMatchUser = req.userId == userId;

    if (!doesTokenMatchUser) {
      logger.error(`User not authorised`);
      res.status(403).json({ error: 'User not authorised' });
      return;
    }

    next();
  } catch (err) {
    logger.error('User ID check failed', err);

    res.status(401).json({ error: 'Invalid or expired token' });

    return;
  }
}
