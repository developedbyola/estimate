// import { z } from 'zod';
// import { procedures } from '../procedures';
// import { router } from '../context';

// export const sessionsRouter = router({
//   me: {
//     list: procedures.protected.query(async ({ ctx }) => {
//       try {
//         const sessions = await ctx.supabase
//           .from('sessions')
//           .select('*')
//           .eq('user_id', ctx.actor.user.id)
//           .order('created_at', { ascending: false });

//         if (sessions.error) {
//           return ctx.fail({
//             code: 'INTERNAL_SERVER_ERROR',
//             message: `We encountered an unexpected error while fetching your sessions. ${sessions.error.message}`,
//           });
//         }

//         return ctx.ok(
//           {
//             sessions:
//               sessions.data?.map((session) => ({
//                 id: session.id,
//                 userId: session.user_id,
//                 revoked: session.revoked,
//                 userAgent: session.user_agent,
//                 ipAddress: session.ip_address,
//                 createdAt: session.created_at,
//                 expiresAt: session.expires_at,
//                 refreshToken: session.refresh_token,
//                 lastActiveAt: session.last_active_at,
//               })) || [],
//           },
//           { httpStatus: 200, path: 'auth.sessions' }
//         );
//       } catch (err) {
//         return ctx.fail(err);
//       }
//     }),

//     revoke: procedures.protected
//       .input(z.object({ sessionId: z.string() }))
//       .mutation(async ({ input, ctx }) => {
//         try {
//           const session = await ctx.supabase
//             .from('sessions')
//             .update({ revoked: true })
//             .eq('id', input.sessionId)
//             .eq('user_id', ctx.actor.user.id);

//           if (session.error) {
//             return ctx.fail({
//               code: 'INTERNAL_SERVER_ERROR',
//               message: session.error.message,
//             });
//           }

//           return ctx.ok({
//             success: true,
//           });
//         } catch (err) {
//           return ctx.fail(err);
//         }
//       }),
//   },
// });
