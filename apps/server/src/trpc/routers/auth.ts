import { z } from 'zod';
import argon2 from 'argon2';
import jwt from '@/utils/jwt';
import time from '@/utils/time';
import { env } from '@/configs/env';
import { getClientIp } from 'request-ip';
import { rateLimiter } from '@/middlewares/rateLimiter';
import { publicProcedure, router } from '../middleware';

// Strong password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Your password should be at least 8 characters long')
  .regex(/[A-Z]/, 'Include at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Include at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Include at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character (!@#$%^&*)')
  .regex(/^\S+$/, 'Password cannot contain spaces');

export const authRouter = router({
  public: {
    register: publicProcedure
      .use(rateLimiter({ points: 10, duration: 5 }))
      .input(
        z.object({
          email: z.string().email('Please enter a valid email address'),
          password: passwordSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { email, password } = input;

        try {
          const hashedPassword = await argon2.hash(password);
          const user = await ctx.supabase
            .from('users')
            .insert({
              password: hashedPassword,
              email: email.trim().toLowerCase(),
            })
            .select('id, created_at, is_onboarded, email')
            .single();

          if (user.error) {
            if (user.error.code === '23505') {
              return ctx.fail({
                code: 'CONFLICT',
                message:
                  'An account with this email already exists. Please use a different email or try logging in instead.',
              });
            }

            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: `We encountered an issue creating your account. ${user.error.message}`,
            });
          }

          return ctx.ok(
            {
              user: {
                id: user.data.id,
                email: user.data.email,
                createdAt: user.data.created_at,
                isOnboarded: user.data.is_onboarded,
              },
            },
            { httpStatus: 200, path: 'auth.register' }
          );
        } catch (err) {
          return ctx.fail(err);
        }
      }),

    login: publicProcedure
      .use(rateLimiter({ points: 10, duration: 5 }))
      .input(
        z.object({
          password: passwordSchema,
          email: z.string().email('Please enter a valid email address'),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { email, password } = input;

        try {
          const user = await ctx.supabase
            .from('users')
            .select('id, created_at, is_onboarded, email, password')
            .eq('email', email.trim().toLowerCase())
            .single();

          if (user.error) {
            if (user.error.code === 'PGRST116') {
              return ctx.fail({
                code: 'UNAUTHORIZED',
                message:
                  'The email you entered is incorrect. Please check your credentials and try again.',
              });
            }
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: user.error.message,
            });
          }

          const isPasswordValid = await argon2.verify(
            user.data.password,
            password
          );
          if (!isPasswordValid) {
            return ctx.fail({
              code: 'UNAUTHORIZED',
              message:
                "The password you entered is incorrect. Please try again or reset your password if you've forgotten it.",
            });
          }

          const sessions = await ctx.supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.data.id);

          if (sessions.error) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: `We encountered an unexpected error while setting up your session. ${sessions.error.message}`,
            });
          }

          if (sessions.data.length > env.MAX_SESSIONS) {
            await ctx.supabase
              .from('sessions')
              .delete()
              .eq('id', sessions.data[0].id);
          }

          const accessToken = await jwt.sign(
            env.ACCESS_TOKEN_SECRET,
            time.unix(env.ACCESS_TOKEN_EXPIRY),
            { userId: user.data.id }
          );

          const refreshToken = await jwt.sign(
            env.REFRESH_TOKEN_SECRET,
            time.unix(env.REFRESH_TOKEN_EXPIRY),
            { userId: user.data.id }
          );

          const ip_address = getClientIp(ctx.req as any);
          const user_agent = ctx.req.header('user-agent');
          const expires_at = time.milliseconds(env.REFRESH_TOKEN_EXPIRY);

          const session = await ctx.supabase
            .from('sessions')
            .insert({
              user_id: user.data.id,
              user_agent: user_agent || 'unknown',
              ip_address: ip_address || 'unknown',
              refresh_token: await argon2.hash(refreshToken),
              expires_at: new Date(expires_at).toISOString(),
            })
            .select('*')
            .single();

          if (session.error) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: `We encountered an unexpected error while setting up your session. ${session.error.message}`,
            });
          }

          return ctx.ok(
            {
              accessToken,
              refreshToken,
              user: {
                id: user.data.id,
                email: user.data.email,
                createdAt: user.data.created_at,
                isOnboarded: user.data.is_onboarded,
              },
              session: {
                id: session.data.id,
                userId: session.data.user_id,
                userAgent: session.data.user_agent,
                ipAddress: session.data.ip_address,
                createdAt: session.data.created_at,
                lastActiveAt: session.data.last_active_at,
                expiresAt: session.data.expires_at,
                revoked: session.data.revoked,
              },
            },
            { httpStatus: 200, path: 'auth.login' }
          );
        } catch (err) {
          return ctx.fail(err);
        }
      }),

    refresh: publicProcedure
      .use(rateLimiter({ points: 10, duration: 5 }))
      .input(
        z.object({
          refreshToken: z.string().min(1, 'Your refresh token is missing'),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const refreshToken = input.refreshToken;

          const actor = await jwt.verify<{
            userId: string;
          }>(env.REFRESH_TOKEN_SECRET, refreshToken);

          if (!actor) {
            return ctx.fail({
              code: 'UNAUTHORIZED',
              message:
                'Your session has expired. Sign in again to regain access.',
            });
          }

          const sessions = await ctx.supabase
            .from('sessions')
            .select('*')
            .eq('user_id', actor.userId);

          if (sessions.error) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: `We could not complete the request, ensure you are connected to an active internet network. ${sessions.error.message}`,
            });
          }

          const session = await (async () => {
            for (const s of sessions.data) {
              if (s.revoked) continue;
              if (s.expires_at && new Date(s.expires_at) < new Date()) continue;
              if (await argon2.verify(s.refresh_token, input.refreshToken)) {
                return s;
              }
            }
            return null;
          })();
          if (!session) {
            return ctx.fail({
              code: 'UNAUTHORIZED',
              message:
                'Your session was either revoked or has expired. Sign in again to regain access.',
            });
          }

          const accessToken = await jwt.sign(
            env.ACCESS_TOKEN_SECRET,
            time.unix(env.ACCESS_TOKEN_EXPIRY),
            { userId: actor.userId }
          );

          const newRefreshToken = await jwt.sign(
            env.REFRESH_TOKEN_SECRET,
            time.unix(env.REFRESH_TOKEN_EXPIRY),
            { userId: actor.userId }
          );

          const expires_at = time.milliseconds(env.REFRESH_TOKEN_EXPIRY);
          const newRefreshTokenHash = await argon2.hash(newRefreshToken);

          const updatedSession = await ctx.supabase
            .from('sessions')
            .update({
              refresh_token: newRefreshTokenHash,
              last_active_at: new Date().toISOString(),
              expires_at: new Date(expires_at).toISOString(),
            })
            .eq('id', session.id)
            .select('*, users(id, email, created_at, is_onboarded)')
            .single();

          if (updatedSession.error || !updatedSession.data) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                updatedSession.error?.message ||
                'Failed to retrieve updated session data.',
            });
          }

          return ctx.ok(
            {
              accessToken,
              refreshToken: newRefreshToken,
              session: {
                id: updatedSession.data.id,
                userId: updatedSession.data.user_id,
                userAgent: updatedSession.data.user_agent,
                ipAddress: updatedSession.data.ip_address,
                createdAt: updatedSession.data.created_at,
                lastActiveAt: updatedSession.data.last_active_at,
                expiresAt: updatedSession.data.expires_at,
                revoked: updatedSession.data.revoked,
              },
              user: {
                id: updatedSession.data.users.id,
                email: updatedSession.data.users.email,
                createdAt: updatedSession.data.users.created_at,
                isOnboarded: updatedSession.data.users.is_onboarded,
              },
            },
            { httpStatus: 200, path: 'auth.refresh' }
          );
        } catch (err) {
          return ctx.fail(err);
        }
      }),

    logout: publicProcedure
      .input(
        z.object({
          refreshToken: z.string().min(1, ''),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const refreshToken = input.refreshToken;
          const { userId } = await jwt.verify<{
            userId: string;
          }>(env.REFRESH_TOKEN_SECRET, refreshToken);

          const sessions = await ctx.supabase
            .from('sessions')
            .select('*')
            .eq('user_id', userId);

          if (sessions.error) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: sessions.error.message,
            });
          }

          const session = await (async () => {
            for (const s of sessions.data) {
              if (await argon2.verify(s.refresh_token, input.refreshToken)) {
                return s;
              }
            }
            return null;
          })();

          if (!session) {
            return ctx.fail({
              code: 'UNAUTHORIZED',
              message: 'This session was either revoked or expired.',
            });
          }

          const deletedSession = await ctx.supabase
            .from('sessions')
            .delete()
            .eq('id', session.id);

          if (deletedSession.error) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: deletedSession.error.message,
            });
          }

          return ctx.ok(
            { success: true },
            { httpStatus: 200, path: 'auth.logout' }
          );
        } catch (err) {
          return ctx.fail(err);
        }
      }),
  },
});
