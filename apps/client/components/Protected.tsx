import React from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/components/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRefreshToken = () => {
  const { auth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onSuccess: async (data: any) => {
      try {
        await AsyncStorage.setItem('access_token', data.accessToken);
      } catch (err) {
        console.error('Failed to store access token:', err);
      }
    },
    onError: (err) => {
      console.error('Token refresh failed:', err);
    },
  });

  const mutate = React.useCallback(() => {
    refresh.mutate(undefined);
  }, [refresh.mutate]);

  React.useEffect(() => {
    if (!auth.isAuthenticated) return;

    mutate();

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 30); // 30 minutes

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, mutate]);

  return { isAuthenticated: auth.isAuthenticated };
};

type Props = {
  children: React.ReactNode;
};
export default function Protected({ children }: Props) {
  const { isAuthenticated } = useRefreshToken();

  return isAuthenticated ? <React.Fragment>{children}</React.Fragment> : null;
}
