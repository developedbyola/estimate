import { z } from 'zod';
import { env } from '@/configs/env';
import { UAParser } from 'ua-parser-js';
import { sha256 } from 'hono/utils/crypto';
import { getConnInfo } from '@hono/node-server/conninfo';
import { protectedProcedure, router } from '@/trpc/middleware';

export const sessionsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.supabase
        .from('sessions')
        .select('*')
        .eq('user_id', ctx.user.id);

      if (sessions.error) {
        return ctx.error({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'We encountered an issue while retrieving your active sessions. Refresh or try again in a few moments. If the problem persists, please contact support.',
        });
      }

      return ctx.success(
        {
          sessions: sessions.data,
        },
        { httpStatus: 200, path: 'session.list' }
      );
    } catch (err) {
      return ctx.error(err);
    }
  }),

  update: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().min(1, 'Please provide a valid session ID'),
        isActive: z.boolean({
          required_error:
            'Please select whether to activate or deactivate this session',
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.supabase
          .from('sessions')
          .update({ is_active: input.isActive })
          .eq('id', input.sessionId)
          .eq('user_id', ctx.user.id)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the session you're trying to update. It may have been already removed or expired.",
          });
        }

        return ctx.success(
          {
            session: session.data,
          },
          { httpStatus: 200, path: 'session.update' }
        );
      } catch (err) {
        return ctx.error(err);
      }
    }),

  get: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().min(1, 'Please provide a valid session ID'),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const session = await ctx.supabase
          .from('sessions')
          .select('*')
          .eq('user_id', ctx.user.id)
          .eq('id', input.sessionId)
          .single();

        if (session.error) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the session you're looking for. Please verify the session ID or try refreshing your device list.",
          });
        }

        return ctx.success(
          {
            session: session.data,
          },
          { httpStatus: 200, path: 'session.get' }
        );
      } catch (err) {
        return ctx.error(err);
      }
    }),

  removeDevice: protectedProcedure
    .input(
      z.object({
        sessionId: z
          .string()
          .min(1, 'Please select a valid session to remove from your devices'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await ctx.supabase
          .from('sessions')
          .delete()
          .eq('user_id', ctx.user.id)
          .eq('id', input.sessionId)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the session you're trying to update. It may have been already removed or expired.",
          });
        }

        return ctx.success(
          {
            session: session.data,
          },
          { httpStatus: 200, path: 'session.removeDevice' }
        );
      } catch (err) {
        return ctx.error(err);
      }
    }),

  removeAllDevice: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const sessions = await ctx.supabase
        .from('sessions')
        .delete()
        .eq('user_id', ctx.user.id)
        .select('*');

      if (!sessions.count) {
        return ctx.error({
          code: 'NOT_FOUND',
          message:
            'No active sessions found. Your account is not currently logged in on any devices.',
        });
      }

      return ctx.success(
        {
          sessions: sessions.data,
        },
        { httpStatus: 200, path: 'session.removeAllDevices' }
      );
    } catch (err) {
      return ctx.error(err);
    }
  }),

  addDevice: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const headers = ctx.req.raw.headers;
      const fingerprint = [
        headers.get('user-agent'),
        headers.get('accept-language'),
        headers.get('sec-ch-ua-platform'),
      ].join('|');

      const deviceId = await sha256(fingerprint);
      const userAgent = headers.get('user-agent') || '';
      const appVersion = headers.get('x-app-version');

      const parser = new UAParser(userAgent);
      const ua = parser.getResult();

      const ip = getConnInfo(ctx.hono).remote.address || 'unknown';

      const existingSessions = await ctx.supabase
        .from('sessions')
        .select('id, created_at')
        .eq('user_id', ctx.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (
        existingSessions.data &&
        existingSessions.data.length >= Number(env.MAX_ACTIVE_SESSIONS)
      ) {
        const oldest = existingSessions.data[0]!;
        await ctx.supabase.from('sessions').delete().eq('id', oldest.id);
      }

      const sessions = await ctx.supabase
        .from('sessions')
        .upsert(
          {
            ip_address: ip,
            is_active: true,
            device_id: deviceId,
            user_id: ctx.user.id,
            app_version: appVersion,
            device_type: ua.os.name || 'unknown',
            os_version: ua.os.version || 'unknown',
            device_name: ua.device.type || 'unknown',
          },
          { onConflict: 'device_id' }
        )
        .select('*')
        .single();

      if (!sessions.data) {
        return ctx.error({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'We encountered an unexpected error while adding your device. Please try again or contact support if the issue continues.',
        });
      }

      return ctx.success(
        {
          sessions: sessions.data,
        },
        { httpStatus: 200, path: 'session.addDevice' }
      );
    } catch (err) {
      return ctx.error(err);
    }
  }),
});
