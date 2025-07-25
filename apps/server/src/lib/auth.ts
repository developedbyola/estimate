import { db } from '@/db';
import { schema } from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  user: { modelName: 'users' },
  account: { modelName: 'accounts' },
  verification: { modelName: 'verifications' },
  session: {
    modelName: 'sessions',
    freshAge: 60 * 15,
    updateAge: 60 * 60 * 24,
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  rateLimit: {
    max: 20,
    window: 10,
    enabled: true,
  },
  cookiePrefix: 'estimate',
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
});
