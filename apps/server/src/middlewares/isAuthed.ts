import jwt from '@/utils/jwt';
import { env } from '@/configs/env';
import { TRPCError } from '@trpc/server';
import { middleware } from '@/trpc/middleware';

export const isAuthed = middleware(async ({ ctx, next }) => {
  const authorization = ctx.req.header('Authorization');
  const accessToken = authorization?.split('Bearer ')[1];

  let actor = null;
  try {
    if (accessToken) {
      actor = await jwt.verify<{ userId: string; sessionId: string }>(
        env.ACCESS_TOKEN_SECRET,
        accessToken
      );
    }
    if (!actor) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this feature.',
      });
    }

    return next({
      ctx: {
        ...ctx,
        actor,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'We encountered an unexpected error while processing your request.',
    });
  }
});
