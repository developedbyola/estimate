import { config } from 'dotenv';
config();

import { Hono } from 'hono';
import { appRouter } from '@/trpc';
import { env } from '@/configs/env';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from '@/trpc/context';

const app = new Hono();

// tRPC routes
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (_opts, c) => createContext(c),
  })
);

const port = Number(env.PORT);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
