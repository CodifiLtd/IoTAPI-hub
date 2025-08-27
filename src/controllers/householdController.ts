import { handleApiError } from '../utils/errorHandler';
import { logger } from '../logger/index';

import type { Response } from 'express';
import type { ApiResponse } from '../types/api';
import type { Household } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth';
import { type HouseholdRequest, householdSchema } from '../schemas/household';
import type { registerHouseholdSuccess } from '../types/household';
import { createHousehold } from '../services/householdService';

export async function registerHousehold(
  req: AuthenticatedRequest<unknown, unknown, HouseholdRequest>,
  res: Response<ApiResponse<registerHouseholdSuccess>>
): Promise<Response<ApiResponse<registerHouseholdSuccess>>> {
  try {
    logger.info('Household registration request');

    const validatedData: HouseholdRequest = householdSchema.parse(req.body);

    logger.info('Creating household');

    const household: Household = await createHousehold(
      validatedData,
      req.userId!
    );

    logger.info(`Household created: ${household.name} (ID: ${household.id})`);

    return res.status(201).json({
      id: household.id,
      name: household.name,
      description: household.description
    });
  } catch (err) {
    return handleApiError(err, res);
  }
}
