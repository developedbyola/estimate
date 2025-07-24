import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: 'postgresql://postgres:postgres@localhost:5432/postgres',
});
