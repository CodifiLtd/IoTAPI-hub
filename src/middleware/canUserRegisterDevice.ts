import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';
import type { DeviceRequest } from '../schemas/device';

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
