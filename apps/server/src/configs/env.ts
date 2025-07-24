import { parseEnv } from '@/utils/parseEnv';

export const env = {
  PORT: Number(parseEnv('PORT')),
  NODE_ENV: parseEnv('NODE_ENV'),
  VERSION: parseEnv('VERSION'),

  SUPABASE_URL: parseEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: parseEnv('SUPABASE_ANON_KEY'),
  SUPABASE_JWT_SECRET: parseEnv('SUPABASE_JWT_SECRET'),
  DATABASE_URL: parseEnv('DATABASE_URL'),

  BETTER_AUTH_SECRET: parseEnv('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: parseEnv('BETTER_AUTH_URL'),
};
