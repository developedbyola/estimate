import * as Cookie from 'hono/cookie';
import { type Context as HonoContext } from 'hono';
import { verifyAccessToken } from '@/utils/jwt';
import { supabaseClient } from '@/lib/supabase';
import { createResponse } from '@/utils/response';
import { TRPCError } from '@trpc/server';

export const createContext = async (c: HonoContext) => {
  let user = null;
  const { success, error } = createResponse();
  const Authorization = c.req.header('Authorization');

  const accessToken = Authorization?.split('Bearer ')[1];

  if (accessToken) {
    try {
      user = await verifyAccessToken(accessToken);

      if (!user) {
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
    user,
    error,
    success,
    hono: c,
    res: c.res,
    req: c.req,
    accessToken,
    cookie: Cookie,
    supabase: supabaseClient,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
