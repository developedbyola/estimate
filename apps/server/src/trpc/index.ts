import { router } from '@/trpc/middleware';
import { authRouter } from '@/trpc/routers/auth';
import { usersRouter } from '@/trpc/routers/users';
import { userFarmsRouter } from '@/trpc/routers/user_farms';
import { userEstimatesRouter } from '@/trpc/routers/user_estimates';
import { userCategoriesRouter } from '@/trpc/routers/user_categories';
import { systemRouter } from '@/trpc/routers/system';

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  userFarms: userFarmsRouter,
  userCategories: userCategoriesRouter,
  userEstimates: userEstimatesRouter,
  system: systemRouter,
});

export type AppRouter = typeof appRouter;
