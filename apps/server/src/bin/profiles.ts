import { z } from 'zod';
import { router } from '../trpc/context';
import { procedures } from '../trpc/procedures';

export const profilesRouter = router({
  me: {
    get: procedures.protected.query(async ({ ctx }) => {
      try {
        const profile = await ctx.supabase
          .from('profiles')
          .select('*')
          .eq('user_id', ctx.actor.user.id)
          .single();

        if (profile.error) {
          return ctx.fail({
            code: 'NOT_FOUND',
            message:
              'Your profile could not be found. Please try logging in again or contact support if the issue persists.',
          });
        }

        return ctx.ok({
          profile: {
            id: profile.data.id,
            userId: profile.data.user_id,
            username: profile.data.username,
            lastName: profile.data.last_name,
            firstName: profile.data.first_name,
            createdAt: profile.data.created_at,
          },
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
    update: procedures.protected
      .input(
        z.object({
          firstName: z
            .string()
            .min(1, 'First name is required')
            .max(100)
            .trim()
            .toLowerCase()
            .optional(),
          lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(100)
            .trim()
            .toLowerCase()
            .optional(),
          username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(32, 'Username must be at most 32 characters')
            .regex(
              /^[a-zA-Z0-9_]+$/,
              'Username can only contain letters, numbers, and underscores'
            )
            .trim()
            .toLowerCase()
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          if (input.username) {
            const { data: existing, error: existingError } = await ctx.supabase
              .from('profiles')
              .select('user_id')
              .eq('username', input.username)
              .neq('user_id', ctx.actor.user.id)
              .maybeSingle();

            if (existingError) {
              return ctx.fail({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Could not check username availability.',
              });
            }

            if (existing) {
              return ctx.fail({
                code: 'USERNAME_TAKEN',
                message:
                  'This username is already taken. Please choose another.',
              });
            }
          }

          const { data: profile, error } = await ctx.supabase
            .from('profiles')
            .upsert(
              {
                user_id: ctx.actor.user.id,
                last_name: input.lastName,
                first_name: input.firstName,
                username: input.username,
              },
              { onConflict: 'user_id' }
            )
            .select()
            .single();

          if (error) {
            return ctx.fail({
              code: 'UPDATE_FAILED',
              message: `Failed to update profile: ${error.message}`,
            });
          }

          return ctx.ok({
            profile: {
              id: profile.id,
              userId: profile.user_id,
              username: profile.username,
              lastName: profile.last_name,
              firstName: profile.first_name,
              createdAt: profile.created_at,
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
  },
  public: {
    getByUserId: procedures.protected
      .input(
        z.object({
          userId: z.string().min(1, 'Profile ID is required'),
        })
      )
      .query(async ({ ctx, input }) => {
        try {
          const profile = await ctx.supabase
            .from('profiles')
            .select('*')
            .eq('user_id', input.userId)
            .single();

          if (profile.error) {
            return ctx.fail({
              code: 'NOT_FOUND',
              message:
                'Profile not found or you do not have permission to view it',
            });
          }

          return ctx.ok({
            profile: {
              id: profile.data.id,
              userId: profile.data.user_id,
              lastName: profile.data.last_name,
              firstName: profile.data.first_name,
              username: profile.data.username,
              createdAt: profile.data.created_at,
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
  },
  admin: {},
});
