import React from 'react';
import * as Device from 'expo-device';
import { Auth } from '@/features/auth';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../../../server/dist/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

type ProviderProps = {
  children: React.ReactNode;
};

export const Provider = ({ children }: ProviderProps) => {
  const { auth } = Auth.useAuth();
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.EXPO_PUBLIC_SERVER_API_URL}/api/trpc`,
        headers: {
          'x-app-version': '0.0.1',
          'x-device-name': Device.deviceName || '',
          'x-device-type': Device.osName || '',
          'x-os-version': Device.osVersion || '',
        },
        async fetch(url, options) {
          const token = auth.accessToken || '';
          return fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });
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
