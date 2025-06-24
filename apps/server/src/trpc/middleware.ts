import { ZodError } from 'zod';
import { auth } from '@/utils/auth';
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

const isAuthed = t.middleware(async ({ ctx, next }) => {
  let actor = null;
  const Authorization = ctx.req.header('Authorization');
  const accessToken = Authorization?.split('Bearer ')[1];

  if (accessToken) {
    try {
      actor = await auth.jwt.verify('access', accessToken);

      if (!actor) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to access this feature.',
        });
      }
    } catch (err: any) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: err.message.includes('expired')
          ? 'Session expired. Refresh tokens.'
          : 'Authentication failed.',
      });
    }
  }

  return next({
    ctx: {
      actor: actor!,
    },
  });
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
