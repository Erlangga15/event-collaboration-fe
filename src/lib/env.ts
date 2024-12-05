/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SHOW_LOGGER: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_BACKEND_URL: z.string().url().optional()
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const env = envSchema.parse(process.env) as z.infer<typeof envSchema>;
