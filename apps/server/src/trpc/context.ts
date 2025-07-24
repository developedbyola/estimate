import { ZodError } from 'zod';
import { initTRPC } from '@trpc/server';
import { response } from '@/utils/response';
import { supabaseClient } from '@/lib/supabase';
import { type Context as HonoContext } from 'hono';

export const createContext = async (c: HonoContext) => {
  return {
    res: c.res,
    req: c.req,
    context: c,
    fail: response.error,
    ok: response.success,
    supabase: supabaseClient,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

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

export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
