import type { Response } from 'express';
import * as deviceConfigService from '../services/deviceConfigService';
import type { DeviceIdParams } from '../schemas/device';
import { deviceIdParamsSchema } from '../schemas/device';
import type { DeviceConfigRequest } from '../schemas/deviceConfig';
import { deviceConfigSchema } from '../schemas/deviceConfig';
import type { AuthenticatedRequest } from '../types/auth';
import type { ApiResponse } from '../types/api';
import type { DeviceConfig } from '@prisma/client';
import { logger } from '../logger';
import { handleApiError } from '../utils/errorHandler';

export async function upsertConfig(
  req: AuthenticatedRequest<DeviceIdParams, unknown, DeviceConfigRequest>,
  res: Response<ApiResponse<DeviceConfig>>
): Promise<Response<ApiResponse<DeviceConfig>>> {
  try {
    logger.info('Update device config request');

    const parsed = deviceIdParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return handleApiError(parsed.error, res);
    }

    const validatedData: DeviceConfigRequest = deviceConfigSchema.parse(
      req.body
    );

    const deviceConfig: DeviceConfig | null =
      await deviceConfigService.upsertDeviceConfig(
        parsed.data.id,
        validatedData.config
      );

    if (!deviceConfig) {
      return res.status(404).json({ error: 'Device config not found' });
    }

    return res.status(200).json({ ...deviceConfig });
  } catch (err: unknown) {
    return handleApiError(err, res);
  }
}

export async function getConfig(
  req: AuthenticatedRequest<DeviceIdParams>,
  res: Response<ApiResponse<DeviceConfig>>
): Promise<Response<ApiResponse<DeviceConfig>>> {
  try {
    logger.info('Get device config request');

    const parsed = deviceIdParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return handleApiError(parsed.error, res);
    }

    logger.info('Retrieving device config');
    const config: DeviceConfig | null =
      await deviceConfigService.getDeviceConfigById(parsed.data.id);

    if (!config) {
      return res.status(404).json({ error: 'Device config not found' });
    }

    return res.status(200).json(config);
  } catch (err: unknown) {
    return handleApiError(err, res);
  }
}
