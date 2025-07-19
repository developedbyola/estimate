import { ZodError } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from '@/trpc/context';
import { getFirstValidationMessage } from '@/utils/validationMessage';
import jwt from '@/utils/jwt';
import { env } from '@/configs/env';

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
        ...shape.data,
        code: shape.data.code,
        path: shape.data.path,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const authorization = ctx.req.header('Authorization');
  const accessToken = authorization?.split('Bearer ')[1];

  if (!accessToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You need to be signed in to access this feature.',
    });
  }

  try {
    const actor = await jwt.verify<{ userId: string }>(
      env.ACCESS_TOKEN_SECRET,
      accessToken
    );

    if (!actor) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'Your sign-in authorization is invalid. Please refresh your sign-in.',
      });
    }

    return next({
      ctx: {
        ...ctx,
        actor,
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
