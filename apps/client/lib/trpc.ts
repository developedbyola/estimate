import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../server/dist/trpc';

export const trpc = createTRPCReact<AppRouter>();
