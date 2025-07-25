import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import { appRouter } from '@/trpc';
import { env } from './configs/env';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from '@/trpc/context';

const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    origin: '*',
    maxAge: 600,
    credentials: true,
    exposeHeaders: ['Content-Length'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// tRPC routes
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/trpc/*',
    createContext: (_opts, c) => createContext(c),
  })
);

app.get('/', (c) => c.text('Hono + tRPC server is running!'));

console.log(`Server is running on port ${env.PORT}`);

export default app;
