import { Pool } from 'pg';
import { env } from '@/configs/env';
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  rateLimit: {
    max: 20,
    window: 10,
    enabled: true,
  },
  cookiePrefix: 'taxed',
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  secret: env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    freshAge: 60 * 15,
    updateAge: 60 * 60 * 24,
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  //   socialProviders: {
  //     google: {
  //       clientId: '',
  //       clientSecret: '',
  //     },
  //     apple: {
  //       clientId: '',
  //       clientSecret: '',
  //     },
  //   },
});
