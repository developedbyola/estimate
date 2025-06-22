import z from 'zod';
import { protectedProcedure, router } from '../middleware';

export const userEstimatesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const estimates = await ctx.supabase
        .from('user_estimates')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false });

      if (estimates.error) {
        return ctx.error({
          code: 'NOT_FOUND',
          message:
            "We couldn't find any saved estimates in your account. Try creating a new estimate to get started!",
        });
      }

      return ctx.success({
        estimates: estimates.data,
      });
    } catch (err) {
      return ctx.error(err);
    }
  }),
  get: protectedProcedure
    .input(z.object({ estimateId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const estimate = await ctx.supabase
          .from('user_estimates')
          .select('*')
          .eq('id', input.estimateId)
          .eq('user_id', ctx.user.id)
          .single();

        if (estimate.error) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the estimate you're looking for. It may have been moved or deleted.",
          });
        }

        return ctx.success({
          estimate: estimate.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, 'Please provide a title for your estimate')
          .max(100, 'Title must be 100 characters or less'),
        farmId: z.string().min(1, 'Please select a farm for this estimate'),
        calculations: z
          .array(z.any())
          .min(1, 'Your estimate must include at least one calculation'),
        description: z
          .string()
          .max(500, 'Description must be 500 characters or less')
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const estimate = await ctx.supabase
          .from('user_estimates')
          .insert({
            title: input.title,
            farm_id: input.farmId,
            description: input.description,
            calculations: input.calculations,
            user_id: ctx.user.id,
          })
          .select('*')
          .single();

        if (!estimate.data) {
          return ctx.error({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an issue while saving your estimate. Please check your information and try again.',
          });
        }

        return ctx.success({
          estimate: estimate.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        estimateId: z.string().min(1, 'Estimate ID is required'),
        title: z
          .string()
          .min(1, 'Title cannot be empty')
          .max(100, 'Title must be 100 characters or less')
          .optional(),
        description: z
          .string()
          .max(500, 'Description must be 500 characters or less')
          .optional(),
        calculations: z
          .array(z.any())
          .min(1, 'Your estimate must include at least one calculation')
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const estimate = await ctx.supabase
          .from('user_estimates')
          .update({
            title: input.title,
            description: input.description,
            calculations: input.calculations,
          })
          .eq('id', input.estimateId)
          .select('*')
          .single();

        if (!estimate.data) {
          return ctx.error({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "We couldn't update your estimate. Please check your changes and try again.",
          });
        }

        return ctx.success({
          estimate: estimate.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        estimateId: z.string().min(1, 'Estimate ID is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const estimate = await ctx.supabase
          .from('user_estimates')
          .delete()
          .eq('id', input.estimateId)
          .select('*')
          .single();

        if (!estimate.data) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "The estimate you're trying to delete couldn't be found. It may have already been removed.",
          });
        }

        return ctx.success({
          estimate: estimate.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
});
