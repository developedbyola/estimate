import { trpc } from '@/lib/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpBatchLink } from '@trpc/client';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${
        process.env.EXPO_PUBLIC_API_URL ||
        'https://estimate-server.onrender.com'
      }/api/trpc`,
      headers: {
        'x-app-version': '0.0.1',
      },
      async fetch(url, options) {
        const token = (await AsyncStorage.getItem('access_token')) || '';
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
