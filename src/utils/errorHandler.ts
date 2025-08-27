import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../logger/index';
import { prismaErrorMessages } from './errorMessages';

import type { Response } from 'express';
import type { ApiResponse } from '../types/api'; //

export function handleApiError<T>(
  err: unknown,
  res: Response<ApiResponse<T>>,
  status = 500
): Response<ApiResponse<T>> {
  logger.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues.map(e => e.message) });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const errorObj = prismaErrorMessages[err.code];

    if (errorObj) {
      return res.status(errorObj.status).json({ error: errorObj.message });
    }

    return res.status(500).json({ error: 'Database error' });
  }

  if (err instanceof Error) {
    return res.status(status).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
}
