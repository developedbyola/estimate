import { router } from '@/trpc/middleware';
import { authRouter } from '@/trpc/routers/auth';
import { usersRouter } from '@/trpc/routers/users';
import { farmsRouter } from '@/trpc/routers/farms';
import { systemRouter } from '@/trpc/routers/system';
import { sessionsRouter } from '@/trpc/routers/sessions';
import { estimatesRouter } from '@/trpc/routers/estimates';
import { categoriesRouter } from '@/trpc/routers/categories';

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  sessions: sessionsRouter,
  farms: farmsRouter,
  categories: categoriesRouter,
  estimates: estimatesRouter,
  system: systemRouter,
});

export type AppRouter = typeof appRouter;
