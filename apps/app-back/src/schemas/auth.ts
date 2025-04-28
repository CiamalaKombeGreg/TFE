import { z } from 'zod';

export const TokenSchema = z.object({
  iss: z.string(),
  aud: z.string(),
  exp: z.string(),
  email: z.string().email(),
  email_verified: z.union([z.string(), z.boolean()]),
  hd: z.string().optional(),
});
