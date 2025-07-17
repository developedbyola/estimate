import React from 'react';
import { useUser } from './Provider';
import { Alert } from 'react-native';
import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';

const useProfile = () => {
  const { auth } = Auth.useAuth();
  const { user, setUser } = useUser();

  const profile = Trpc.client.users.me.get.useQuery(undefined, {
    enabled: auth.isAuthenticated && !user,
  });

  React.useEffect(() => {
    const data = profile.data as any;
    if (profile.status === 'error') {
      Alert.alert(
        'Failed to load profile',
        profile.error?.message || 'Please try again later',
        [
          { text: 'OK', isPreferred: false },
          {
            text: 'Retry',
            isPreferred: true,
            onPress: () => profile.refetch(),
          },
        ]
      );
    }
    if (profile.status === 'success') {
      setUser({ type: 'SET_USER', payload: { user: data?.user } });
    }
  }, [profile.status]);

  return { status: profile.status };
};

export const Get = ({ children }: { children: React.ReactNode }) => {
  const _ = useProfile();

  return children;
};
