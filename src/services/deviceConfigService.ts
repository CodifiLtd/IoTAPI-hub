import { prisma } from '../database/index';

import type { DeviceConfig } from '@prisma/client';

export async function upsertDeviceConfig(
  deviceId: number,
  config: Record<string, unknown>
): Promise<DeviceConfig | null> {
  // Upsert device config
  const deviceConfig = await prisma.deviceConfig.upsert({
    where: { deviceId },
    update: { config: JSON.stringify(config) },
    create: { deviceId, config: JSON.stringify(config) }
  });

  // Also upsert device state while we are here
  await prisma.deviceState.upsert({
    where: { deviceId },
    update: { state: JSON.stringify(config) },
    create: { deviceId, state: JSON.stringify(config) }
  });

  return deviceConfig;
}

export async function getDeviceConfigById(
  deviceId: number
): Promise<DeviceConfig | null> {
  return await prisma.deviceConfig.findUnique({
    where: { deviceId }
  });
}
