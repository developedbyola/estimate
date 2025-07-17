import { ZodError } from 'zod';
import { initTRPC } from '@trpc/server';
import type { Context } from '@/trpc/context';
import { isAuthed } from '@/middlewares/isAuthed';
import { getFirstValidationMessage } from '@/utils/validationMessage';

export const t = initTRPC.context<Context>().create({
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

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
