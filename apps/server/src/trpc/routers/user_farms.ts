import z from 'zod';
import { protectedProcedure, router } from '../middleware';

const SELECT = `*, category:category_id(id, name, icon, created_at)`;

export const userFarmsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const farms = await ctx.supabase
        .from('user_farms')
        .select(SELECT)
        .eq('user_id', ctx.actor.userId)
        .order('created_at', { ascending: false });

      if (farms.error) {
        return ctx.fail({
          code: 'NOT_FOUND',
          message:
            "We couldn't find any farms in your account. Try adding a new farm to get started!",
        });
      }

      return ctx.ok({
        farms: farms.data,
      });
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  get: protectedProcedure
    .input(z.object({ farmId: z.string().min(1, 'Farm ID is required') }))
    .query(async ({ input, ctx }) => {
      try {
        const farm = await ctx.supabase
          .from('user_farms')
          .select(SELECT)
          .eq('id', input.farmId)
          .eq('user_id', ctx.actor.userId)
          .single();

        if (farm.error) {
          return ctx.fail({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the farm you're looking for. It may have been moved or deleted.",
          });
        }

        return ctx.ok({
          farm: farm.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        farmId: z.string().min(1, 'Farm ID is required'),
        name: z.string().min(1, 'Farm name cannot be empty').optional(),
        size: z
          .string()
          .refine(
            (value) =>
              value === undefined ||
              (!isNaN(Number(value)) && Number(value) > 0),
            'Please enter a valid positive number for the farm size'
          )
          .optional(),
        city: z.string().min(1, 'City cannot be empty').optional(),
        state: z.string().min(1, 'State/region cannot be empty').optional(),
        address: z.string().min(1, 'Address cannot be empty').optional(),
        categoryId: z
          .string()
          .min(1, 'Please select a valid category')
          .optional(),
        size_unit: z
          .enum(['acres', 'hectares', 'square meters'], {
            errorMap: () => ({
              message: 'Please select a valid unit of measurement',
            }),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const farm = await ctx.supabase
          .from('user_farms')
          .update({
            name: input.name,
            size: input.size,
            city: input.city,
            state: input.state,
            address: input.address,
            size_unit: input.size_unit,
            category_id: input.categoryId,
          })
          .eq('id', input.farmId)
          .eq('user_id', ctx.actor.userId)
          .select(SELECT)
          .single();

        if (!farm.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We couldn’t find the farm record you’re trying to update.',
          });
        }

        return ctx.ok({
          farm: farm.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  delete: protectedProcedure
    .input(z.object({ farmId: z.string().min(1, 'Farm ID is required') }))
    .mutation(async ({ input, ctx }) => {
      try {
        const farm = await ctx.supabase
          .from('user_farms')
          .delete()
          .eq('id', input.farmId)
          .eq('user_id', ctx.actor.userId)
          .select(SELECT)
          .single();

        if (!farm.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No farm found',
          });
        }

        return ctx.ok({
          farm: farm.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Please provide a name for your farm'),
        city: z
          .string()
          .min(1, 'Please provide the city where your farm is located'),
        state: z
          .string()
          .min(1, 'Please provide the state/region of your farm'),
        address: z.string().min(1, 'Please provide the address of your farm'),
        categoryId: z.string().min(1, 'Please select a category for your farm'),
        size: z
          .string()
          .min(1, 'Please enter the size of your farm')
          .refine(
            (value) => !isNaN(Number(value)) && Number(value) > 0,
            'Please enter a valid positive number for the farm size'
          ),
        size_unit: z.enum(['acres', 'hectares', 'square meters'], {
          errorMap: () => ({
            message: 'Please select a valid unit of measurement',
          }),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const farm = await ctx.supabase
          .from('user_farms')
          .insert({
            name: input.name,
            city: input.city,
            size: input.size,
            state: input.state,
            user_id: ctx.actor.userId,
            address: input.address,
            size_unit: input.size_unit,
            category_id: input.categoryId,
          })
          .select(SELECT)
          .single();

        if (!farm.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "We couldn't create your farm at this time. Please check your information and try again.",
          });
        }

        return ctx.ok({
          farm: farm.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
});
