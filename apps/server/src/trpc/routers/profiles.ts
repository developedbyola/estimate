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
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const { data: profile, error } = await ctx.supabase
            .from('profiles')
            .upsert(
              {
                user_id: ctx.actor.userId,
                last_name: input.lastName,
                first_name: input.firstName,
              },
              { onConflict: 'user_id' }
            )
            .select()
            .single();

          if (error) {
            return ctx.fail({
              code: 'UPDATE_FAILED',
              message: 'Failed to update profile. Please try again.',
            });
          }

          return ctx.ok({
            profile: {
              id: profile.id,
              userId: profile.user_id,
              firstName: profile.first_name,
              lastName: profile.last_name,
              createdAt: profile.created_at,
            },
          });
        } catch (err) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'An unexpected error occurred while updating your profile.',
          });
        }
      }),
  },
  public: {
    getById: protectedProcedure
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
