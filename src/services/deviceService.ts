import { prisma } from '../database/index';

import type { Device } from '@prisma/client';
import type { DeviceRequest } from '../schemas/device';

export async function createDevice(data: DeviceRequest): Promise<Device> {
  const {
    serialNumber,
    name,
    description,
    firmwareVersion,
    householdId,
    deviceTypeId
  } = data;
  return await prisma.device.create({
    data: {
      serialNumber,
      name,
      description,
      firmwareVersion,
      householdId,
      deviceTypeId
    }
  });
}

export async function getDeviceById(id: number): Promise<Device | null> {
  return await prisma.device.findUnique({
    where: { id }
  });
}
