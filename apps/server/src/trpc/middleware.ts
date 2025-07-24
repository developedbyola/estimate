import jwt from '@/utils/jwt';
import { ZodError } from 'zod';
import { env } from '@/configs/env';
import { response } from '@/utils/response';
import type { Context } from '@/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';

const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { shape, error } = opts;
    return {
      ...shape,
      message:
        error.cause instanceof ZodError
          ? response.zod.getFirstMessage(error)
          : error.message,
      data: {
        ...shape.data,
        code: shape.data.code,
        path: shape.data.path,
      } satisfies typeof shape.data,
    };
  },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  try {
    const session = await auth.api.getSession({ headers: ctx.req.raw.headers });

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to access this feature.',
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: session.user,
        session: session.session,
      },
    });
  } catch (err) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `An unexpected error occurred while verifying your sign-in authorization. ${
        (err as any)?.message
      }`,
    });
  }
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
