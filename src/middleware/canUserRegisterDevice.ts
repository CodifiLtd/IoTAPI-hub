import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';
import type { DeviceRequest } from '../schemas/device';

/**
 * Express middleware to check if the user is a guest.
 * Prevents guests from registering devices to a household.
 * Responds with 403 if user is a guest, else calls next().
 * @param {AuthenticatedRequest} req - Express request object with user/household info.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {void}
 */
export function isGuest(
  req: AuthenticatedRequest<unknown, unknown, DeviceRequest>,
  res: Response,
  next: NextFunction
): void {
  try {
    logger.info('Checking user role');

    const isUserGuest = req.households?.some(
      userHousehold => userHousehold.roleId === 3
    );

    if (isUserGuest) {
      logger.error('Guest not permitted to register device to household');
      res
        .status(403)
        .json({ error: 'Guest not permitted to register device to household' });

      return;
    }

    next();
  } catch (err) {
    logger.error('User role check failed', err);

    res.status(401).json({ error: 'Invalid or expired token' });

    return;
  }
}
