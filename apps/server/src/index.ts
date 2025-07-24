import { Hono } from 'hono';
import { appRouter } from '@/trpc';
import { auth } from '@/lib/auth';
import { env } from './configs/env';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from '@/trpc/context';

const app = new Hono().basePath('/api');

app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

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
