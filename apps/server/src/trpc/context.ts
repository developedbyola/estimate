import { auth } from '@/utils/auth';
import { TRPCError } from '@trpc/server';
import { supabaseClient } from '@/lib/supabase';
import { createResponse } from '@/utils/response';
import { type Context as HonoContext } from 'hono';

export const createContext = async (c: HonoContext) => {
  let actor = null;
  const { success, error } = createResponse();
  const Authorization = c.req.header('Authorization');

  const accessToken = Authorization?.split('Bearer ')[1];

  if (accessToken) {
    try {
      actor = await auth.jwt.verify('access', accessToken);

      if (!actor) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access to this route',
        });
      }
    } catch (err) {
      throw new TRPCError(err as any);
    }
  }

  return {
    fail: error,
    ok: success,
    res: c.res,
    req: c.req,
    honoContext: c,
    actor: actor!,
    supabase: supabaseClient,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
