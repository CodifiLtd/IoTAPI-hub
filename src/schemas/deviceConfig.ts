import { z } from 'zod';

export const deviceConfigSchema = z.object({
  config: z.object().loose()
});

export type DeviceConfigRequest = z.infer<typeof deviceConfigSchema>;
