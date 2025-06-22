import { config } from 'dotenv';
config();

import { Hono } from 'hono';
import { appRouter } from '@/trpc';
import { env } from '@/configs/env';
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

if (process.env.NODE_ENV !== 'production') {
  const { serve } = await import('@hono/node-server');
  const port = Number(env.PORT);
  console.log(`Server is running on port ${port}`);
  serve({ fetch: app.fetch, port });
}

app.get('/', (c) => c.text('Hono + tRPC server is running!'));

export default app;
