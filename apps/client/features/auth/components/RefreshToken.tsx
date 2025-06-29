import React from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from './Provider';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onSuccess: async (data: any) => {
      await AsyncStorage.setItem('access_token', data.accessToken);
      await SecureStore.setItemAsync('refresh_token', data.refreshToken);
    },
    onError: (err) => {
      if (err.message.includes('expired')) {
        setAuth({ type: 'LOGOUT' });
      }
    },
  });

  const mutate = React.useCallback(async () => {
    const refreshToken = (await SecureStore.getItemAsync('refresh_token'))!;
    refresh.mutate({ refreshToken });
  }, [refresh.mutate]);

  React.useEffect(() => {
    if (!auth.isAuthenticated) return;

    mutate();

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 30);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, mutate]);
};

type Props = {
  children: React.ReactNode;
};

export const RefreshToken = ({ children }: Props) => {
  useRefreshToken();

  return children;
};
