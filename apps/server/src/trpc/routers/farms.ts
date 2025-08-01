import z from 'zod';
import { router } from '../context';
import { procedures } from '../procedures';

const SELECT = `*, category:category_id(id, name, icon, created_at)`;

export const farmsRouter = router({
  me: {
    list: procedures.protected.query(async ({ ctx }) => {
      try {
        const farms = await ctx.supabase
          .from('farms')
          .select(SELECT)
          .eq('user_id', ctx.actor.user.id)
          .order('created_at', { ascending: false });

        if (farms.error) {
          return ctx.fail({
            code: 'NOT_FOUND',
            message:
              "We couldn't find any farms in your account. Try adding a new farm to get started!",
          });
        }

        return ctx.ok({
          farms: farms.data.map((farm) => ({
            id: farm.id,
            name: farm.name,
            size: farm.size,
            city: farm.city,
            state: farm.state,
            address: farm.address,
            sizeUnit: farm.size_unit,
            categoryId: farm.category_id,
            userId: farm.user_id,
            updatedAt: farm.updated_at,
            createdAt: farm.created_at,
            category: {
              id: farm.category.id,
              name: farm.category.name,
              icon: farm.category.icon,
              createdAt: farm.category.created_at,
            },
          })),
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

    get: procedures.protected
      .input(z.object({ farmId: z.string().min(1, 'Farm ID is required') }))
      .query(async ({ input, ctx }) => {
        try {
          const farm = await ctx.supabase
            .from('farms')
            .select(SELECT)
            .eq('id', input.farmId)
            .eq('user_id', ctx.actor.user.id)
            .single();

          if (farm.error) {
            return ctx.fail({
              code: 'NOT_FOUND',
              message:
                "We couldn't find the farm you're looking for. It may have been moved or deleted.",
            });
          }

          return ctx.ok({
            farm: {
              id: farm.data.id,
              name: farm.data.name,
              size: farm.data.size,
              city: farm.data.city,
              state: farm.data.state,
              address: farm.data.address,
              sizeUnit: farm.data.size_unit,
              categoryId: farm.data.category_id,
              createdAt: farm.data.created_at,
              updatedAt: farm.data.updated_at,
              userId: farm.data.user_id,
              category: {
                id: farm.data.category.id,
                name: farm.data.category.name,
                icon: farm.data.category.icon,
                createdAt: farm.data.category.created_at,
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
          sizeUnit: z.enum(['acres', 'hectares', 'square meters']).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const farm = await ctx.supabase
            .from('farms')
            .update({
              name: input.name,
              size: input.size,
              city: input.city,
              state: input.state,
              address: input.address,
              size_unit: input.sizeUnit,
              category_id: input.categoryId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', input.farmId)
            .eq('user_id', ctx.actor.user.id)
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
            farm: {
              id: farm.data.id,
              name: farm.data.name,
              size: farm.data.size,
              city: farm.data.city,
              state: farm.data.state,
              address: farm.data.address,
              sizeUnit: farm.data.size_unit,
              categoryId: farm.data.category_id,
              createdAt: farm.data.created_at,
              updatedAt: farm.data.updated_at,
              userId: farm.data.user_id,
              category: {
                id: farm.data.category.id,
                name: farm.data.category.name,
                icon: farm.data.category.icon,
                createdAt: farm.data.category.created_at,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),

    delete: procedures.protected
      .input(z.object({ farmId: z.string().min(1, 'Farm ID is required') }))
      .mutation(async ({ input, ctx }) => {
        try {
          const farm = await ctx.supabase
            .from('farms')
            .delete()
            .eq('id', input.farmId)
            .eq('user_id', ctx.actor.user.id)
            .select(SELECT)
            .single();

          if (!farm.data) {
            return ctx.fail({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'No farm found',
            });
          }

          return ctx.ok({
            farm: {
              id: farm.data.id,
              name: farm.data.name,
              size: farm.data.size,
              city: farm.data.city,
              state: farm.data.state,
              address: farm.data.address,
              sizeUnit: farm.data.size_unit,
              categoryId: farm.data.category_id,
              createdAt: farm.data.created_at,
              updatedAt: farm.data.updated_at,
              userId: farm.data.user_id,
              category: {
                id: farm.data.category.id,
                name: farm.data.category.name,
                icon: farm.data.category.icon,
                createdAt: farm.data.category.created_at,
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
          name: z.string().min(1, 'Please provide a name for your farm'),
          city: z
            .string()
            .min(1, 'Please provide the city where your farm is located'),
          state: z
            .string()
            .min(1, 'Please provide the state/region of your farm'),
          address: z.string().min(1, 'Please provide the address of your farm'),
          categoryId: z
            .string()
            .min(1, 'Please select a category for your farm'),
          size: z
            .string()
            .min(1, 'Please enter the size of your farm')
            .refine(
              (value) => !isNaN(Number(value)) && Number(value) > 0,
              'Please enter a valid positive number for the farm size'
            ),
          sizeUnit: z.enum(['acres', 'hectares', 'square meters']),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const farm = await ctx.supabase
            .from('farms')
            .insert({
              name: input.name,
              city: input.city,
              size: input.size,
              state: input.state,
              user_id: ctx.actor.user.id,
              address: input.address,
              size_unit: input.sizeUnit,
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
            farm: {
              id: farm.data.id,
              name: farm.data.name,
              size: farm.data.size,
              city: farm.data.city,
              state: farm.data.state,
              address: farm.data.address,
              sizeUnit: farm.data.size_unit,
              categoryId: farm.data.category_id,
              createdAt: farm.data.created_at,
              updatedAt: farm.data.updated_at,
              userId: farm.data.user_id,
              category: {
                id: farm.data.category.id,
                name: farm.data.category.name,
                icon: farm.data.category.icon,
                createdAt: farm.data.category.created_at,
              },
            },
          });
        } catch (err) {
          return ctx.fail(err);
        }
      }),
  },
});
