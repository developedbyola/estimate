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
