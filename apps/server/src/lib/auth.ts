import { env } from '@/configs/env';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  secret: env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: '',
      clientSecret: '',
    },
    apple: {
      clientId: '',
      clientSecret: '',
    },
  },
});
