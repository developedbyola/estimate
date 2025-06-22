import { z } from 'zod';
import argon2 from 'argon2';
import { publicProcedure, protectedProcedure, router } from '../middleware';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { env } from '@/configs/env';

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
      const userFromDB = await ctx.supabase
        .from('users')
        .select('id, created_at, name, email')
        .eq('id', ctx.user.id)
        .single();

      if (userFromDB.error) {
        return ctx.error({
          code: 'NOT_FOUND',
          message:
            'Your account could not be found. Please try logging in again or contact support if the issue persists.',
        });
      }

      return ctx.success(
        {
          user: {
            id: userFromDB.data.id,
            name: userFromDB.data.name,
            email: userFromDB.data.email,
            createdAt: userFromDB.data.created_at,
          },
        },
        { httpStatus: 200, path: 'auth.me' }
      );
    } catch (err) {
      return ctx.error(err);
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
        const user = await ctx.supabase
          .from('users')
          .select('id, created_at, name, email, password')
          .eq('email', email)
          .single();

        if (user.error) {
          return ctx.error({
            code: 'UNAUTHORIZED',
            message:
              'The email or password you entered is incorrect. Please check your credentials and try again.',
          });
        }

        const isPasswordValid = await argon2.verify(
          user.data.password,
          password
        );

        if (!isPasswordValid) {
          return ctx.error({
            code: 'UNAUTHORIZED',
            message:
              "The password you entered is incorrect. Please try again or reset your password if you've forgotten it.",
          });
        }

        const userData = {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
          createdAt: user.data.created_at,
        };

        const accessToken = await signAccessToken(userData);
        const refreshToken = await signRefreshToken(userData);

        ctx.cookie.setCookie(ctx.hono, 'refresh_token', refreshToken, {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 90,
          secure: env.NODE_ENV === 'production',
        });

        return ctx.success(
          {
            accessToken,
            user: userData,
          },
          { httpStatus: 200, path: 'auth.login' }
        );
      } catch (err) {
        return ctx.error(err);
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
          return ctx.error({
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
          return ctx.error({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an issue creating your account. Please try again in a few moments.',
          });
        }

        return ctx.success(
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
        return ctx.error(err);
      }
    }),

  refresh: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const refreshToken = ctx.cookie.getCookie(ctx.hono, 'refresh_token');

      if (!refreshToken) {
        return ctx.error({
          code: 'UNAUTHORIZED',
          message: 'Your session has expired. Please log in again.',
        });
      }

      const user = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(user);

      ctx.cookie.setCookie(ctx.hono, 'refresh_token', refreshToken, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 90,
        secure: env.NODE_ENV === 'production',
      });

      return ctx.success(
        { accessToken },
        { httpStatus: 200, path: 'auth.refresh' }
      );
    } catch (err) {
      return ctx.error(err);
    }
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const refreshToken = ctx.cookie.getCookie(ctx.hono, 'refresh_token');

      if (!refreshToken) {
        return ctx.error({
          code: 'UNAUTHORIZED',
          message: 'Your session has expired. Please log in again.',
        });
      }

      ctx.cookie.deleteCookie(ctx.hono, 'refresh_token');
      return ctx.success(
        { success: true },
        { httpStatus: 200, path: 'auth.logout' }
      );
    } catch (err) {
      return ctx.error(err);
    }
  }),
});
