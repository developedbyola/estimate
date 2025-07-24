import { env } from '@/configs/env';
import { router } from '../context';
import { procedures } from '../procedures';

export const systemRouter = router({
  public: {
    health: procedures.public.query(({ ctx }) => {
      return ctx.ok({
        status: 'OK',
      });
    }),
    version: procedures.public.query(({ ctx }) => {
      return ctx.ok({
        version: env.VERSION,
      });
    }),
    ping: procedures.public.query(({ ctx }) => {
      return ctx.ok({
        message: 'pong',
      });
    }),
  },
});
