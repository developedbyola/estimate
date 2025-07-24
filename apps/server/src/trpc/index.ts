import { router } from '@/trpc/middleware';
import { usersRouter } from '@/trpc/routers/users';
import { farmsRouter } from '@/trpc/routers/farms';
import { systemRouter } from '@/trpc/routers/system';
import { sessionsRouter } from '@/trpc/routers/sessions';
import { estimatesRouter } from '@/trpc/routers/estimates';
import { categoriesRouter } from '@/trpc/routers/categories';
import { profilesRouter } from '@/trpc/routers/profiles';

export const appRouter = router({
  users: usersRouter,
  sessions: sessionsRouter,
  farms: farmsRouter,
  categories: categoriesRouter,
  estimates: estimatesRouter,
  profiles: profilesRouter,
  system: systemRouter,
});

export type AppRouter = typeof appRouter;
