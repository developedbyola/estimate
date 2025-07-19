import React from 'react';
import { Alert } from '@/components';
import { Trpc } from '@/features/trpc';
import { useAuth } from '../components/Provider';

export const useRefreshToken = () => {
  const alert = Alert.useAlert();
  const { refreshToken, isLoading, setAuth } = useAuth();

  const refresh = Trpc.client.auth.public.refresh.useMutation({
    onSuccess: async (data: any) => {
      setAuth({
        type: 'SET_TOKENS',
        payload: {
          user: data?.user,
          session: data?.session,
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
        },
      });
    },
    onError: (err, input) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        setAuth({ type: 'LOGOUT' });
        return;
      }
      alert.open({
        variant: 'destructive',
        message: 'Failed to refresh token',
        action: {
          label: 'Retry',
          onPress: () => {
            refresh.mutateAsync(input);
          },
        },
      });
      setAuth({ type: 'ERROR' });
    },
  });

  const mutate = React.useCallback(async () => {
    if (!refreshToken) {
      setAuth({ type: 'LOGOUT' });
      return;
    }
    await refresh.mutateAsync({ refreshToken });
  }, [refreshToken]);

  React.useEffect(() => {
    if (isLoading) {
      mutate();
    }

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 25);

    return () => clearInterval(interval);
  }, [isLoading, mutate]);
};
