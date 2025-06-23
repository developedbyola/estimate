import { z } from 'zod';
import argon2 from 'argon2';
import { auth } from '../../utils/auth';
import { publicProcedure, protectedProcedure, router } from '../middleware';

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
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.supabase
        .from('users')
        .select('id, created_at, name, email')
        .eq('id', ctx.actor.userId)
        .single();

      if (!user.data) {
        return ctx.fail({
          code: 'NOT_FOUND',
          message:
            'Your account could not be found. Please try logging in again or contact support if the issue persists.',
        });
      }

      return ctx.ok(
        {
          user: {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            createdAt: user.data.created_at,
          },
        },
        { httpStatus: 200, path: 'auth.me' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  login: publicProcedure
    .input(
      z.object({
        password: passwordSchema,
        email: z.string().email('Please enter a valid email address'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      try {
        // Get user from database
        const user = await ctx.supabase
          .from('users')
          .select('id, created_at, name, email, password')
          .eq('email', email)
          .single();

        // Check if user exists
        if (!user.data) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              'The email you entered is incorrect. Please check your credentials and try again.',
          });
        }

        // Check if password is valid
        const isPasswordValid = await argon2.verify(
          user.data.password,
          password
        );

        // Check if password is valid
        if (!isPasswordValid) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              "The password you entered is incorrect. Please try again or reset your password if you've forgotten it.",
          });
        }

        // Get session data
        const {
          deviceName,
          deviceType,
          osVersion,
          appVersion,
          ipAddress,
          fingerprint,
          expiresAt,
        } = await auth.session(ctx.honoContext);

        // Create session
        const session = await ctx.supabase
          .from('user_sessions')
          .upsert(
            {
              fingerprint,
              is_active: true,
              os_version: osVersion,
              user_id: user.data.id,
              ip_address: ipAddress,
              expires_at: expiresAt,
              device_name: deviceName,
              device_type: deviceType,
              app_version: appVersion,
            },
            { onConflict: 'fingerprint' }
          )
          .select('id')
          .single();

        // Check if session was created
        if (!session.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an unexpected error while setting up your session. Please try again or contact support if the issue continues.',
          });
        }

        // Get user data
        const userData = {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
          createdAt: user.data.created_at,
        };

        // Sign access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            userId: userData.id,
            sessionId: session.data.id,
          },
        });

        // Sign refresh token
        const refreshToken = await auth.jwt.sign({
          type: 'refresh',
          payload: {
            userId: userData.id,
            sessionId: session.data.id,
          },
        });

        // Return access token and user data
        return ctx.ok(
          { accessToken, refreshToken, user: userData },
          { httpStatus: 200, path: 'auth.login' }
        );
      } catch (err) {
        console.log(err);
        return ctx.fail(err);
      }
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, 'Please enter your full name (at least 2 characters)'),
        email: z.string().email('Please enter a valid email address'),
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      try {
        const previousUser = await ctx.supabase
          .from('users')
          .select('id, created_at, name, email')
          .eq('email', email)
          .single();

        if (previousUser.data) {
          return ctx.fail({
            code: 'CONFLICT',
            message:
              'An account with this email already exists. Please use a different email or try logging in instead.',
          });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await ctx.supabase
          .from('users')
          .insert({ name, email, password: hashedPassword })
          .select('id, created_at, name, email')
          .single();

        if (user.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an issue creating your account. Please try again in a few moments.',
          });
        }

        return ctx.ok(
          {
            user: {
              id: user.data.id,
              name: user.data.name,
              email: user.data.email,
              createdAt: user.data.created_at,
            },
          },
          { httpStatus: 200, path: 'auth.register' }
        );
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  refresh: publicProcedure
    .input(
      z.object({
        refreshToken: z.string().min(1, 'Your refresh token is missing'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const refreshToken = input.refreshToken;

        // Verify the refresh token
        const { userId, sessionId } = (await auth.jwt.verify(
          'refresh',
          refreshToken
        )) as any;

        const session = await ctx.supabase
          .from('user_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        const isSessionNotFound = !session.data;
        const isSessionInactive = !session.data?.is_active;
        const isSessionExpired = session.data?.expires_at < Date.now();

        if (isSessionNotFound || isSessionInactive || isSessionExpired) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Your session has expired. Please log in again.',
          });
        }

        // Create a new access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            userId,
            sessionId,
          },
        });

        return ctx.ok(
          { accessToken, refreshToken },
          { httpStatus: 200, path: 'auth.refresh' }
        );
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  sessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', ctx.actor.userId)
        .order('created_at', { ascending: false });

      return ctx.ok(
        {
          sessions: sessions.data,
        },
        { httpStatus: 200, path: 'auth.sessions' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('id', input.sessionId)
          .eq('user_id', ctx.actor.userId)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an issue while revoking your session. Please try again later.',
          });
        }

        return ctx.ok({
          success: true,
        });
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
        const actor = await auth.jwt.verify('refresh', refreshToken);

        const session = await ctx.supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('id', actor.sessionId)
          .eq('user_id', actor.userId)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Your session has expired. Please log in again.',
          });
        }

        return ctx.ok(
          { success: true },
          { httpStatus: 200, path: 'auth.logout' }
        );
      } catch (err) {
        console.log(err);
        return ctx.fail(err);
      }
    }),
});
