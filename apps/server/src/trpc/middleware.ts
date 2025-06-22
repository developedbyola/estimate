import { ZodError } from 'zod';
import type { Context } from '@/trpc/context';
import { TRPCError, initTRPC } from '@trpc/server';
import { getFirstValidationMessage } from '@/utils/validationMessage';

const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { shape, error } = opts;

    return {
      ...shape,
      message:
        error.cause instanceof ZodError
          ? getFirstValidationMessage(error)
          : error.message,
      data: {
        code: shape.data.code,
        path: shape.data.path,
      },
    };
  },
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized access to this route',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
