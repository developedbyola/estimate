import { trpc } from '@/lib/trpc';
import { httpBatchLink } from '@trpc/client';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${process.env.SERVER_ENDPOINT}/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
