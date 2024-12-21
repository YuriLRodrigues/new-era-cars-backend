import { z } from 'zod';

export const envSchema = z.object({
  SERVICE: z.string(),
  VERSION: z.string().default('1.0.0'),
  PORT: z.string().default('3333'),

  ENDPOINT_UPLOAD: z.string(),
  APP_URL_AUTOCARS: z.string(),
  SENDGRID_API_KEY: z.string(),
  DATABASE_URL: z.string(),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
