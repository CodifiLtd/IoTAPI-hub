import { z } from 'zod';

/**
 * Zod schema for device config validation.
 * Requires a config object.
 */
export const deviceConfigSchema = z.object({
  config: z.object().loose()
});

/**
 * Type for device config request inferred from deviceConfigSchema.
 */
export type DeviceConfigRequest = z.infer<typeof deviceConfigSchema>;
