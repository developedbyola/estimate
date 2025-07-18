import React from 'react';
import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/Provider';

export const useRefreshToken = () => {
  const router = useRouter();
  const { auth, setAuth } = useAuth();

  const refresh = Trpc.client.auth.public.refresh.useMutation({
    onSuccess: async (data: any) => {
      setAuth({
        type: 'SET_TOKENS',
        payload: {
          auth: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
          },
        },
      });
    },
    onError: (err, input) => {
      if (err.message.toLowerCase().includes('sign in')) {
        Alert.alert('Session expired', err.message, [
          {
            text: 'Sign in',
            isPreferred: true,
            onPress: () => {
              setAuth({ type: 'LOGOUT' });
              router.replace('/login');
            },
          },
        ]);
        return;
      }

      Alert.alert('Authentication error', err.message, [
        {
          text: 'Retry',
          onPress: () => {
            refresh.mutate(input);
          },
        },
      ]);
    },
  });

  const mutate = React.useCallback(async () => {
    if (!auth.refreshToken) return;
    await refresh.mutateAsync({ refreshToken: auth.refreshToken });
  }, [auth.refreshToken]);

  React.useEffect(() => {
    if (auth.isLoading) {
      mutate();
    }

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 25);

    return () => clearInterval(interval);
  }, [auth.isLoading, mutate]);
};
