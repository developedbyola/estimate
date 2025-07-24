import { procedure } from './context';
import { isProtected } from '@/middlewares/isProtected';
import { rateLimiter } from '@/middlewares/rateLimiter';

export const procedures = {
  public: procedure,
  protected: procedure.use(isProtected),
  rateLimited: (points: number, duration: number) =>
    procedure.use(rateLimiter({ points, duration })),
};
