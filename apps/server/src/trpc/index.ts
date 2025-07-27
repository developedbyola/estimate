import { router } from './context';
import { farmsRouter } from '@/trpc/routers/farms';
import { systemRouter } from '@/trpc/routers/system';
import { estimatesRouter } from '@/trpc/routers/estimates';
import { categoriesRouter } from '@/trpc/routers/categories';

export const appRouter = router({
  farms: farmsRouter,
  system: systemRouter,
  estimates: estimatesRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
