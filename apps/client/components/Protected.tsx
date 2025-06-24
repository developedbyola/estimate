import React from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/components/Auth';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRefreshToken = () => {
  const { auth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onSuccess: async (data: any) => {
      await AsyncStorage.setItem('access_token', data.accessToken);
      await SecureStore.setItemAsync('refresh_token', data.refreshToken);
    },
    onError: (err) => {
      console.error('Token refresh failed:', err);
    },
  });

  const mutate = React.useCallback(async () => {
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = (await SecureStore.getItemAsync('refresh_token'))!;
    refresh.mutate({ refreshToken });
  }, [refresh.mutate]);

  React.useEffect(() => {
    if (!auth.isAuthenticated) return;

    mutate();

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 0.25); // 1 minutes

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
