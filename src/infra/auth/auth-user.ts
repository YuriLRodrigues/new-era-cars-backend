import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  roles: z.string().array(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;
