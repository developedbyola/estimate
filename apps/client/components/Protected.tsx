import React from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  children: React.ReactNode;
};

export default function Protected({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const refresh = trpc.auth.refresh.useMutation();

  const mutate = React.useCallback(() => {
    refresh.mutate(undefined, {
      onSuccess: (data) => {
        AsyncStorage.setItem('accessToken', (data as any).accessToken);
      },
    });
  }, [refresh]);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    mutate();

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * 60); // 1 hour

    return () => clearInterval(interval);
  }, [isAuthenticated, mutate]);

  return isAuthenticated ? <React.Fragment>{children}</React.Fragment> : null;
}
