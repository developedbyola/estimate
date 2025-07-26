import React from 'react';
import { auth } from '@/lib/auth';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../../../server/dist/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

type ProviderProps = {
  children: React.ReactNode;
};

export const Provider = ({ children }: ProviderProps) => {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.EXPO_PUBLIC_SERVER_API_URL}/api/trpc`,
        headers: () => {
          const headers = new Map<string, string>();
          const cookies = auth.getCookie();
          if (cookies) {
            headers.set('Cookie', cookies);
          }
          return Object.fromEntries(headers);
        },
      }),
    ],
  });

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
