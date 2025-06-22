import z from 'zod';
import { protectedProcedure, router } from '../middleware';

export const userCategoriesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', ctx.user.id);

      if (categories.error) {
        return ctx.error({
          code: 'NOT_FOUND',
          message:
            "We couldn't find any categories in your account. Try creating one to get started!",
        });
      }

      return ctx.success({
        categories: categories.data,
      });
    } catch (err) {
      return ctx.error(err);
    }
  }),
  get: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .select('*')
          .eq('id', input.categoryId)
          .eq('user_id', ctx.user.id)
          .single();

        if (category.error) {
          return ctx.error({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the category you're looking for. It may have been moved or deleted.",
          });
        }

        return ctx.success({
          category: category.data,
        });
      } catch (err) {
        return ctx.error({
          message:
            'An unexpected error occurred while fetching the category. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Please provide a category name')
          .max(50, 'Category name must be 50 characters or less'),
        icon: z.string().min(1, 'Please select an icon'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .insert({ name: input.name, icon: input.icon, user_id: ctx.user.id })
          .select('*')
          .single();

        if (!category.data) {
          console.error('Category creation failed:', category.error);
          return ctx.error({
            message:
              "We couldn't create your category. Please check your connection and try again.",
            code: 'BAD_REQUEST',
          });
        }

        return ctx.success({
          category: category.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().min(1, 'Category ID is required'),
        name: z
          .string()
          .min(1, 'Please provide a category name')
          .max(50, 'Category name must be 50 characters or less')
          .optional(),
        icon: z.string().min(1, 'Please select an icon').optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .update({ name: input.name, icon: input.icon })
          .eq('id', input.categoryId)
          .eq('user_id', ctx.user.id)
          .select('*')
          .single();

        if (!category.data) {
          return ctx.error({
            message:
              'An unexpected error occurred while updating the category. Please try again.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.success({
          category: category.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({ categoryId: z.string().min(1, 'Category ID is required') })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .delete()
          .eq('id', input.categoryId)
          .eq('user_id', ctx.user.id)
          .select('*')
          .single();

        if (!category.data) {
          return ctx.error({
            message:
              'An unexpected error occurred while deleting the category. Please try again.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.success({
          category: category.data,
        });
      } catch (err) {
        return ctx.error(err);
      }
    }),
});
