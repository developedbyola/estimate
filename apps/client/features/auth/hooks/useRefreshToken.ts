import React from 'react';
import { Trpc } from '@/features/trpc';
import { useAuth } from '../components/Provider';

export const useRefreshToken = () => {
  const { auth, isLoading, setAuth } = useAuth();

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
    onError: (err) => {
      console.error(err.message);
      setAuth({ type: 'ERROR' });
    },
  });

  const mutate = React.useCallback(async () => {
    await refresh.mutateAsync({ refreshToken: auth.refreshToken || '' });
  }, [auth.refreshToken]);

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
