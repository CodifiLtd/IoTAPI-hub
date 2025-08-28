import type { Response, NextFunction } from 'express';
import { logger } from '../logger/index';
import type { AuthenticatedRequest } from '../types/auth';

/**
 * Express middleware to check if the user is part of the specified household.
 * Responds with 403 if user is not part of the household, else calls next().
 * @param {AuthenticatedRequest} req - Express request object with user/household info.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {void}
 */
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
