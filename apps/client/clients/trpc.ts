import { trpc } from '@/lib/trpc';
import { httpBatchLink } from '@trpc/client';

// if (!process.env.EXPO_PUBLIC_API_URL) {
//   throw new Error('Missing API URL');
// }

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${
        process.env.EXPO_PUBLIC_API_URL ||
        'https://estimate-server.onrender.com'
      }/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
