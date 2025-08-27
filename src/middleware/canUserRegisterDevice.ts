import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';
import type { DeviceRequest } from '../schemas/device';

export function canUserRegisterDevice(
  req: AuthenticatedRequest<unknown, unknown, DeviceRequest>,
  res: Response,
  next: NextFunction
): void {
  try {
    logger.info('Checking user part of household');

    const householdId = req.body.householdId;

    const isUserOfHousehold = req.households?.some(
      userHousehold => userHousehold.id === householdId
    );

    if (!isUserOfHousehold) {
      logger.error(
        `User ${req.userId} not part of household ${req.body.householdId}`
      );
      res.status(403).json({ error: 'User not part of household' });
      return;
    }

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
    logger.error('User checks for register device failed', err);

    res.status(401).json({ error: 'Invalid or expired token' });

    return;
  }
}
