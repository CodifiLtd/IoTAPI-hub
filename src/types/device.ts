import type { Device } from '@prisma/client';

export type registerDeviceSuccess = Omit<Device, 'createdAt' | 'updatedAt'>;
