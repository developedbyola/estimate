import { z } from 'zod';
import { protectedProcedure, router } from '../middleware';

export const profilesRouter = router({
  me: {
    get: protectedProcedure.query(async ({ ctx }) => {
      try {
        const profile = await ctx.supabase
          .from('profiles')
          .select('*')
          .eq('user_id', ctx.actor.userId)
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
    update: protectedProcedure
      .input(
        z.object({
          firstName: z
            .string()
            .min(1, 'First name is required')
            .max(100)
            .optional(),
          lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(100)
            .optional(),
          username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(32, 'Username must be at most 32 characters')
            .regex(
              /^[a-zA-Z0-9_]+$/,
              'Username can only contain letters, numbers, and underscores'
            )
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
              .neq('user_id', ctx.actor.userId)
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
                user_id: ctx.actor.userId,
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
              firstName: profile.first_name,
              lastName: profile.last_name,
              username: profile.username,
              createdAt: profile.created_at,
            },
          });
        } catch (err) {
          console.error('Profile update error:', err);
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'An unexpected error occurred while updating your profile.',
          });
        }
      }),
  },
  public: {
    getByUserId: protectedProcedure
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
          return ctx.fail({
            message:
              'An unexpected error occurred while fetching the profile. Please try again later.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }
      }),
  },
  admin: {},
});
