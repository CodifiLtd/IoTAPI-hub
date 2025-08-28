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
    where: { id },
    include: { config: true }
  });
}

export async function deleteDeviceById(
  deviceId: number,
  householdId: number
): Promise<Device | null> {
  // verify that the device belongs to the household
  const device = await prisma.device.findFirst({
    where: { id: deviceId, householdId }
  });

  if (!device) {
    return null;
  }

  // Delete the device
  return prisma.device.delete({ where: { id: deviceId } });
}
