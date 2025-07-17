import { t } from '@/trpc/middleware';
import { getClientIp } from 'request-ip';
import { TRPCError } from '@trpc/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimiter = (options: { points: number; duration: number }) => {
  const rl = new RateLimiterMemory({
    points: options.points,
    duration: options.duration,
  });

  return t.middleware(async ({ ctx, next }) => {
    const ip = getClientIp(ctx.req as any) || 'unknown';

    try {
      await rl.consume(ip as string);
      return next();
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Too many requests. Please try again later.',
      });
    }
  });
};
