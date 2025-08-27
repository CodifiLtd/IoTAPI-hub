import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';

export function checkUserHouseholdId(
  req: AuthenticatedRequest<unknown, unknown, { householdId: number }>,
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

    next();
  } catch (err) {
    logger.error('User household check failed', err);

    res.status(401).json({ error: 'Invalid or expired token' });

    return;
  }
}
