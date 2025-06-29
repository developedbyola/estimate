import React from 'react';
import { trpc } from '@/lib/trpc';
import { useUser } from './Provider';
import { Alert } from 'react-native';
import { Auth } from '@/features/auth';

const useProfile = () => {
  const { auth } = Auth.useAuth();
  const { user, setUser } = useUser();

  const profile = trpc.users.profile.useQuery(undefined, {
    enabled: auth.isAuthenticated && !user,
  });

  React.useEffect(() => {
    const data = profile.data as any;
    if (!data) return;
    setUser({ type: 'SET_USER', payload: { user: data?.user } });
  }, [profile.data]);

  return { profile };
};

export const Profile = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();

  if (profile.error) {
    Alert.alert(
      'Failed to load user',
      profile.error?.message || 'Please try again later',
      [
        { text: 'OK' },
        {
          text: 'Retry',
          onPress: () => profile.refetch(),
        },
      ]
    );
  }

  return children;
};
