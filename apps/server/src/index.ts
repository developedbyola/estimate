// import { config } from 'dotenv';
// config();

import { Hono } from 'hono';
import { appRouter } from '@/trpc';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from '@/trpc/context';
import { env } from './configs/env';

const app = new Hono();

app.use;

// tRPC routes
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (_opts, c) => createContext(c),
  })
);

app.get('/', (c) => c.text('Hono + tRPC server is running!'));

console.log(`Server is running on port ${env.PORT}`);

export default app;
