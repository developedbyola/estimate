import z from 'zod';
import { router } from '../context';
import { procedures } from '../procedures';

const select = '*, farm:farm_id(*)';

export const estimatesRouter = router({
  me: {
    list: procedures.protected
      .input(
        z.object({
          farmId: z.string().min(1, 'Farm ID is required').optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        try {
          let query = ctx.supabase
            .from('estimates')
            .select(select)
            .eq('user_id', ctx.actor.user.id);

          if (input.farmId) {
            query = query.eq('farm_id', input.farmId);
          }

          const estimates = await query.order('created_at', {
            ascending: false,
          });

          if (estimates.error) {
            return ctx.fail({
              code: 'NOT_FOUND',
              message:
                "We couldn't find any saved estimates in your account. Try creating a new estimate to get started!",
            });
          }

          return ctx.ok({
            estimates: estimates.data.map((estimate) => ({
              id: estimate.id,
              title: estimate.title,
              farmId: estimate.farm_id,
              userId: estimate.user_id,
              updatedAt: estimate.updated_at,
              createdAt: estimate.created_at,
              calculations: estimate.calculations,
              farm: {
                id: estimate.farm.id,
                name: estimate.farm.name,
                size: estimate.farm.size,
                city: estimate.farm.city,
                state: estimate.farm.state,
                address: estimate.farm.address,
                sizeUnit: estimate.farm.size_unit,
                categoryId: estimate.farm.category_id,
                createdAt: estimate.farm.created_at,
                updatedAt: estimate.farm.updated_at,
                userId: estimate.farm.user_id,
              },
            })),
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
    get: procedures.protected
      .input(z.object({ estimateId: z.string() }))
      .query(async ({ input, ctx }) => {
        try {
          const estimate = await ctx.supabase
            .from('estimates')
            .select(select)
            .eq('id', input.estimateId)
            .eq('user_id', ctx.actor.user.id)
            .single();

          if (estimate.error) {
            return ctx.fail({
              code: 'NOT_FOUND',
              message:
                "We couldn't find the estimate you're looking for. It may have been moved or deleted.",
            });
          }

          return ctx.ok({
            estimate: {
              id: estimate.data.id,
              title: estimate.data.title,
              farmId: estimate.data.farm_id,
              userId: estimate.data.user_id,
              updatedAt: estimate.data.updated_at,
              createdAt: estimate.data.created_at,
              calculations: estimate.data.calculations,
              farm: {
                id: estimate.data.farm.id,
                name: estimate.data.farm.name,
                size: estimate.data.farm.size,
                city: estimate.data.farm.city,
                state: estimate.data.farm.state,
                address: estimate.data.farm.address,
                sizeUnit: estimate.data.farm.size_unit,
                categoryId: estimate.data.farm.category_id,
                createdAt: estimate.data.farm.created_at,
                updatedAt: estimate.data.farm.updated_at,
                userId: estimate.data.farm.user_id,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
    create: procedures.protected
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
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const estimate = await ctx.supabase
            .from('estimates')
            .insert({
              title: input.title,
              farm_id: input.farmId,
              calculations: input.calculations,
              user_id: ctx.actor.user.id,
            })
            .select(select)
            .single();

          if (!estimate.data) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                'We encountered an issue while saving your estimate. Please check your information and try again.',
            });
          }

          return ctx.ok({
            estimate: {
              id: estimate.data.id,
              title: estimate.data.title,
              farmId: estimate.data.farm_id,
              userId: estimate.data.user_id,
              updatedAt: estimate.data.updated_at,
              createdAt: estimate.data.created_at,
              calculations: estimate.data.calculations,
              farm: {
                id: estimate.data.farm.id,
                name: estimate.data.farm.name,
                size: estimate.data.farm.size,
                city: estimate.data.farm.city,
                state: estimate.data.farm.state,
                address: estimate.data.farm.address,
                sizeUnit: estimate.data.farm.size_unit,
                categoryId: estimate.data.farm.category_id,
                createdAt: estimate.data.farm.created_at,
                updatedAt: estimate.data.farm.updated_at,
                userId: estimate.data.farm.user_id,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
    update: procedures.protected
      .input(
        z.object({
          estimateId: z.string().min(1, 'Estimate ID is required'),
          title: z
            .string()
            .min(1, 'Title cannot be empty')
            .max(100, 'Title must be 100 characters or less')
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
            .from('estimates')
            .update({
              title: input.title,
              calculations: input.calculations,
              updated_at: new Date().toISOString(),
            })
            .eq('id', input.estimateId)
            .select(select)
            .single();

          if (!estimate.data) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                "We couldn't update your estimate. Please check your changes and try again.",
            });
          }

          return ctx.ok({
            estimate: {
              id: estimate.data.id,
              title: estimate.data.title,
              userId: estimate.data.user_id,
              farmId: estimate.data.farm_id,
              updatedAt: estimate.data.updated_at,
              createdAt: estimate.data.created_at,
              calculations: estimate.data.calculations,
              farm: {
                id: estimate.data.farm.id,
                name: estimate.data.farm.name,
                size: estimate.data.farm.size,
                city: estimate.data.farm.city,
                state: estimate.data.farm.state,
                address: estimate.data.farm.address,
                sizeUnit: estimate.data.farm.size_unit,
                categoryId: estimate.data.farm.category_id,
                createdAt: estimate.data.farm.created_at,
                updatedAt: estimate.data.farm.updated_at,
                userId: estimate.data.farm.user_id,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
    delete: procedures.protected
      .input(
        z.object({
          estimateId: z.string().min(1, 'Estimate ID is required'),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const estimate = await ctx.supabase
            .from('estimates')
            .delete()
            .eq('id', input.estimateId)
            .select(select)
            .single();

          if (!estimate.data) {
            return ctx.fail({
              code: 'NOT_FOUND',
              message:
                "The estimate you're trying to delete couldn't be found. It may have already been removed.",
            });
          }

          return ctx.ok({
            estimate: {
              id: estimate.data.id,
              title: estimate.data.title,
              userId: estimate.data.user_id,
              farmId: estimate.data.farm_id,
              updatedAt: estimate.data.updated_at,
              createdAt: estimate.data.created_at,
              calculations: estimate.data.calculations,
              farm: {
                id: estimate.data.farm.id,
                name: estimate.data.farm.name,
                size: estimate.data.farm.size,
                city: estimate.data.farm.city,
                state: estimate.data.farm.state,
                address: estimate.data.farm.address,
                sizeUnit: estimate.data.farm.size_unit,
                categoryId: estimate.data.farm.category_id,
                createdAt: estimate.data.farm.created_at,
                updatedAt: estimate.data.farm.updated_at,
                userId: estimate.data.farm.user_id,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
  },
  admin: {},
  public: {},
});
