// import { z } from 'zod';
// import argon2 from 'argon2';
// import { router } from '../context';
// import { procedures } from '../procedures';

// const passwordSchema = z
//   .string()
//   .min(8, 'Password must be at least 8 characters long')
//   .regex(/^\S+$/, 'Password must not contain any spaces')
//   .regex(/[0-9]/, 'Password must contain at least one number')
//   .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//   .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//   .regex(
//     /[^A-Za-z0-9]/,
//     'Password must contain at least one special character'
//   );

// export const usersRouter = router({
//   me: {
//     get: procedures.protected.query(async ({ ctx }) => {
//       try {
//         const user = await ctx.supabase
//           .from('users')
//           .select('id, created_at, is_onboarded, email')
//           .eq('id', ctx.actor.user.id)
//           .single();

//         if (!user.data) {
//           return ctx.fail({
//             code: 'NOT_FOUND',
//             message:
//               'Your account could not be found. Please try logging in again or contact support if the issue persists.',
//           });
//         }

//         return ctx.ok(
//           {
//             user: {
//               id: user.data.id,
//               email: user.data.email,
//               createdAt: user.data.created_at,
//               isOnboarded: user.data.is_onboarded,
//             },
//           },
//           { httpStatus: 200, path: 'users.profile' }
//         );
//       } catch (err) {
//         return ctx.fail(err);
//       }
//     }),
//     update: procedures.protected
//       .input(
//         z.object({
//           isOnboarded: z.boolean().optional(),
//         })
//       )
//       .mutation(async ({ input, ctx }) => {
//         try {
//           const user = await ctx.supabase
//             .from('users')
//             .update({
//               is_onboarded: input.isOnboarded,
//             })
//             .eq('id', ctx.actor.user.id)
//             .select('id, created_at, is_onboarded, email')
//             .single();

//           if (user.error) {
//             return ctx.fail({
//               code: 'INTERNAL_SERVER_ERROR',
//               message:
//                 'We encountered an issue while updating your profile. Please try again later.',
//             });
//           }

//           return ctx.ok({
//             user: {
//               id: user.data.id,
//               email: user.data.email,
//               createdAt: user.data.created_at,
//               isOnboarded: user.data.is_onboarded,
//             },
//           });
//         } catch (err) {
//           return ctx.fail(err);
//         }
//       }),
//     changePassword: procedures.protected
//       .input(
//         z.object({
//           newPassword: passwordSchema,
//           currentPassword: z.string().min(3, 'Current password is required'),
//         })
//       )
//       .mutation(async ({ input, ctx }) => {
//         try {
//           const user = await ctx.supabase
//             .from('users')
//             .select('password')
//             .eq('id', ctx.actor.user.id)
//             .single();

//           if (!user.data) {
//             return ctx.fail({
//               code: 'NOT_FOUND',
//               message:
//                 'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
//             });
//           }

//           const isSamePassword = await argon2.verify(
//             user.data.password,
//             input.currentPassword
//           );

//           if (!isSamePassword) {
//             return ctx.fail({
//               code: 'UNAUTHORIZED',
//               message:
//                 'The password you entered is incorrect. Please try again.',
//             });
//           }

//           const hashedPassword = await argon2.hash(input.newPassword);

//           // Update password using Supabase Auth
//           const updatedUser = await ctx.supabase
//             .from('users')
//             .update({
//               password: hashedPassword,
//             })
//             .eq('id', ctx.actor.user.id)
//             .select('id, created_at')
//             .single();

//           if (updatedUser.error) {
//             return ctx.fail({
//               code: 'INTERNAL_SERVER_ERROR',
//               message:
//                 'We encountered an issue while updating your password. Please try again later.',
//             });
//           }

//           return ctx.ok({
//             success: true,
//           });
//         } catch (err) {
//           return ctx.fail(err);
//         }
//       }),

//     changeEmail: procedures.protected
//       .input(
//         z.object({
//           email: z.string().email('Please enter a valid email address'),
//           password: z
//             .string()
//             .min(3, 'Password is required to confirm this change'),
//         })
//       )
//       .mutation(async ({ input, ctx }) => {
//         try {
//           // Verify password first
//           const user = await ctx.supabase
//             .from('users')
//             .select('password')
//             .eq('id', ctx.actor.user.id)
//             .single();

//           if (!user.data) {
//             return ctx.fail({
//               code: 'NOT_FOUND',
//               message:
//                 'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
//             });
//           }

//           const isSamePassword = await argon2.verify(
//             user.data.password,
//             input.password
//           );

//           if (!isSamePassword) {
//             return ctx.fail({
//               code: 'UNAUTHORIZED',
//               message:
//                 'The password you entered is incorrect. Please try again.',
//             });
//           }

//           // Check if email is already in use by another account
//           const existingUser = await ctx.supabase
//             .from('users')
//             .select('id')
//             .eq('email', input.email)
//             .neq('id', ctx.actor.user.id)
//             .single();

//           if (existingUser.data) {
//             return ctx.fail({
//               code: 'CONFLICT',
//               message:
//                 'This email address is already associated with another account. Please use a different email address.',
//             });
//           }

//           // Update email using Supabase Auth
//           const { error: updateError } = await ctx.supabase
//             .from('users')
//             .update({
//               email: input.email,
//             })
//             .eq('id', ctx.actor.user.id)
//             .select('id, name, created_at')
//             .single();

//           if (updateError) {
//             return ctx.fail({
//               code: 'INTERNAL_SERVER_ERROR',
//               message:
//                 'We encountered an issue while updating your email address. Please try again later.',
//             });
//           }

//           return ctx.ok({
//             success: true,
//           });
//         } catch (err) {
//           return ctx.fail(err);
//         }
//       }),

//     public: {
//       getById: procedures.public
//         .input(
//           z.object({
//             userId: z.string().min(1, 'User ID is required'),
//           })
//         )
//         .query(async ({ input, ctx }) => {
//           try {
//             const user = await ctx.supabase
//               .from('users')
//               .select('id, email, is_onboarded, created_at')
//               .eq('id', input.userId)
//               .single();

//             if (!user.data) {
//               return ctx.fail({
//                 code: 'NOT_FOUND',
//                 message:
//                   'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
//               });
//             }

//             return ctx.ok({
//               user: {
//                 id: user.data.id,
//                 email: user.data.email,
//                 createdAt: user.data.created_at,
//                 isOnboarded: user.data.is_onboarded,
//               },
//             });
//           } catch (err) {
//             return ctx.fail(err);
//           }
//         }),
//     },
//     admin: {},
//   },
// });
