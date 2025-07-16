import { env } from '@/configs/env';
import { router } from '../middleware';
import { publicProcedure } from '../middleware';

export const systemRouter = router({
  public: {
    health: publicProcedure.query(() => ({
      status: 'OK',
    })),
    version: publicProcedure.query(() => ({
      version: env.VERSION,
    })),
    ping: publicProcedure.query(() => ({
      message: 'pong',
    })),
  },
});
