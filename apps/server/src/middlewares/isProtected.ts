import { middleware } from '@/trpc/context';
import { auth } from '@/lib/auth';
import { TRPCError } from '@trpc/server';

export const isProtected = middleware(async ({ ctx, next }) => {
  try {
    const session = await auth.api.getSession({ headers: ctx.req.raw.headers });

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to access this feature.',
      });
    }

    return next({ ctx: { ...ctx, actor: session } });
  } catch (err) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `An unexpected error occurred while verifying your sign-in authorization. ${
        (err as any)?.message
      }`,
    });
  }
});
