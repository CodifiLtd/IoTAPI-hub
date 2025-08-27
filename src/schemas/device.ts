import { z } from 'zod';

export const deviceSchema = z.object({
  serialNumber: z.string('Serial number is required'),
  name: z.string('Name is required'),
  description: z.string().optional(),
  firmwareVersion: z.string().optional(),
  householdId: z.number('Household ID is required'),
  deviceTypeId: z.number('Device Type ID is required')
});

export type DeviceRequest = z.infer<typeof deviceSchema>;
